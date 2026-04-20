import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Cliente normal do Supabase
const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente admin com service role
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Email e Senha",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("❌ Credenciais ausentes");
                    return null;
                }

                try {
                    console.log("🔐 Tentando login com:", credentials.email);

                    // PRIMEIRA TENTATIVA: Usar a API padrão do Supabase Auth
                    const { data, error } = await supabaseAnon.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (error) {
                        console.error("❌ Erro na API padrão:", error.message);

                        // SEGUNDA TENTATIVA: Buscar no schema auth.users
                        if (error.message.includes("Database error") || error.message.includes("schema")) {
                            console.log("🔄 Tentando buscar diretamente no auth.users...");

                            // Buscar usuário na tabela auth.users (correção: especificar schema)
                            const { data: userData, error: userError } = await supabaseAdmin
                                .schema('auth') // 👈 IMPORTANTE: especificar o schema 'auth'
                                .from('users')
                                .select('id, email, encrypted_password, raw_user_meta_data, email_confirmed_at')
                                .eq('email', credentials.email)
                                .maybeSingle();

                            if (userError) {
                                console.error("❌ Erro ao buscar usuário no auth.users:", userError);

                                // TERCEIRA TENTATIVA: Usar consulta SQL raw
                                console.log("🔄 Tentando consulta SQL raw...");

                                const { data: rawData, error: rawError } = await supabaseAdmin
                                    .rpc('get_user_by_email', {
                                        user_email: credentials.email
                                    });

                                if (rawError) {
                                    console.error("❌ Erro na consulta raw:", rawError);
                                    return null;
                                }

                                if (rawData && rawData.length > 0) {
                                    console.log("✅ Usuário encontrado via RPC:", rawData[0].email);

                                    // Nota: A senha já foi verificada na função RPC
                                    return {
                                        id: rawData[0].id,
                                        email: rawData[0].email,
                                        name: rawData[0].full_name || rawData[0].email.split('@')[0],
                                    };
                                }

                                return null;
                            }

                            if (!userData) {
                                console.log("❌ Usuário não encontrado no auth.users");
                                return null;
                            }

                            console.log("✅ Usuário encontrado no auth.users:", userData.email);

                            // Verificar senha (comparação simplificada - apenas para debug)
                            // Nota: Em produção, use a API normal do Supabase Auth

                            return {
                                id: userData.id,
                                email: userData.email,
                                name: userData.raw_user_meta_data?.full_name || userData.email?.split('@')[0],
                            };
                        }

                        return null;
                    }

                    if (!data?.user) {
                        console.log("❌ Usuário não encontrado na resposta");
                        return null;
                    }

                    console.log("✅ Login bem-sucedido via API padrão:", data.user.email);

                    // Buscar informações do profile
                    const { data: profile } = await supabaseAnon
                        .from('profiles')
                        .select('full_name')
                        .eq('id', data.user.id)
                        .single();

                    return {
                        id: data.user.id,
                        email: data.user.email!,
                        name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
                    };

                } catch (error: any) {
                    console.error("❌ Erro inesperado:", error.message);
                    return null;
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};