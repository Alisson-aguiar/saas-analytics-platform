import { createClient } from "@supabase/supabase-js";

// Validar se as variáveis existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error("❌ NEXT_PUBLIC_SUPABASE_URL não definida no .env.local");
}

if (!supabaseAnonKey) {
    throw new Error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não definida no .env.local");
}

if (!supabaseServiceKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY não definida. Operações de escrita podem falhar.");
}

// Cliente para operações normais (SELECT)
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);

// Cliente ADMIN com service role para operações de escrita
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : supabase; // Fallback para o cliente normal se a service key não existir

// Log para debug
console.log("🔧 Supabase configurado:", {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey
});