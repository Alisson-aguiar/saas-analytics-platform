if (typeof window !== 'undefined') {
    throw new Error('GoogleSheetsService só pode ser usado no servidor');
}

import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabase/client';

export interface GoogleSheetsConnection {
    id: string;
    userId: string;
    name: string;
    spreadsheetId: string;
    sheetName: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    lastSyncAt?: Date;
    active: boolean;
}



export class GoogleSheetsService {
    private oauth2Client: any;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    // Gerar URL de autenticação
    getAuthUrl(): string {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file'
            ],
            prompt: 'consent'
        });
    }

    // Trocar código por tokens
    async getTokens(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }

    // Refresh token
    async refreshAccessToken(refreshToken: string) {
        this.oauth2Client.setCredentials({ refresh_token: refreshToken });
        const { credentials } = await this.oauth2Client.refreshAccessToken();
        return credentials;
    }

    // Salvar conexão no banco
    async saveConnection(userId: string, data: {
        name: string;
        spreadsheetId: string;
        sheetName: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    }): Promise<GoogleSheetsConnection | null> {
        try {
            const { data: connection, error } = await supabaseAdmin
                .from('google_sheets_connections')
                .insert({
                    user_id: userId,
                    name: data.name,
                    spreadsheet_id: data.spreadsheetId,
                    sheet_name: data.sheetName,
                    access_token: data.accessToken,
                    refresh_token: data.refreshToken,
                    expires_at: data.expiresAt.toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            return {
                id: connection.id,
                userId: connection.user_id,
                name: connection.name,
                spreadsheetId: connection.spreadsheet_id,
                sheetName: connection.sheet_name,
                accessToken: connection.access_token,
                refreshToken: connection.refresh_token,
                expiresAt: new Date(connection.expires_at),
                lastSyncAt: connection.last_sync_at ? new Date(connection.last_sync_at) : undefined,
                active: connection.active
            };
        } catch (error) {
            console.error("Erro ao salvar conexão:", error);
            return null;
        }
    }

    // Exportar dados para o Google Sheets
    async exportToSheet(connectionId: string, data: any[][], sheetName?: string) {
        try {
            // Buscar conexão
            const { data: connection, error } = await supabaseAdmin
                .from('google_sheets_connections')
                .select('*')
                .eq('id', connectionId)
                .single();

            if (error) throw error;

            // Verificar se token expirou
            let accessToken = connection.access_token;
            if (new Date(connection.expires_at) < new Date()) {
                const newTokens = await this.refreshAccessToken(connection.refresh_token);
                accessToken = newTokens.access_token!;

                // Atualizar token no banco
                await supabaseAdmin
                    .from('google_sheets_connections')
                    .update({
                        access_token: accessToken,
                        expires_at: new Date(Date.now() + (newTokens.expiry_date || 3600000)).toISOString()
                    })
                    .eq('id', connectionId);
            }

            // Configurar cliente com token atualizado
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });

            // Limpar dados existentes
            await sheets.spreadsheets.values.clear({
                spreadsheetId: connection.spreadsheet_id,
                range: `${sheetName || connection.sheet_name}!A:ZZ`
            });

            // Escrever novos dados
            const response = await sheets.spreadsheets.values.update({
                spreadsheetId: connection.spreadsheet_id,
                range: `${sheetName || connection.sheet_name}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: data }
            });

            // Atualizar último sync
            await supabaseAdmin
                .from('google_sheets_connections')
                .update({ last_sync_at: new Date().toISOString() })
                .eq('id', connectionId);

            return response.data;
        } catch (error) {
            console.error("Erro ao exportar para Google Sheets:", error);
            throw error;
        }
    }

    // Buscar conexões do usuário
    async getUserConnections(userId: string): Promise<GoogleSheetsConnection[]> {
        try {
            const { data, error } = await supabaseAdmin
                .from('google_sheets_connections')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(conn => ({
                id: conn.id,
                userId: conn.user_id,
                name: conn.name,
                spreadsheetId: conn.spreadsheet_id,
                sheetName: conn.sheet_name,
                accessToken: conn.access_token,
                refreshToken: conn.refresh_token,
                expiresAt: new Date(conn.expires_at),
                lastSyncAt: conn.last_sync_at ? new Date(conn.last_sync_at) : undefined,
                active: conn.active
            }));
        } catch (error) {
            console.error("Erro ao buscar conexões:", error);
            return [];
        }
    }

    // Deletar conexão
    async deleteConnection(connectionId: string): Promise<boolean> {
        try {
            const { error } = await supabaseAdmin
                .from('google_sheets_connections')
                .delete()
                .eq('id', connectionId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Erro ao deletar conexão:", error);
            return false;
        }
    }
}

export const googleSheetsService = new GoogleSheetsService();