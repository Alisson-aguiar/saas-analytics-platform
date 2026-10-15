import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Ping simples no Supabase
        const start = Date.now();
        const { error } = await supabase.from("profiles").select("id").limit(1);
        const dbTime = Date.now() - start;

        return NextResponse.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            checks: {
                database: error ? "error" : "ok",
                dbResponseTimeMs: dbTime,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: String(error) },
            { status: 500 }
        );
    }
}