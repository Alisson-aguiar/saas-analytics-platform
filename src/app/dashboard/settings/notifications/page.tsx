"use client";

import { useSession } from "next-auth/react";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <NotificationsSettings userId={session?.user?.id || ''} />;
}