"use client";

import { useSession } from "next-auth/react";
import { APISettings } from "@/components/settings/APISettings";
import { Loader2 } from "lucide-react";

export default function APIPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <APISettings userId={session?.user?.id || ''} />;
}