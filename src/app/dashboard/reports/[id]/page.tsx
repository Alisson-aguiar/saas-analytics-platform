"use client";

import { useParams } from "next/navigation";
import ReportBuilder from "@/components/reports/ReportBuilder";

export default function ReportPage() {
    const params = useParams();
    const reportId = params.id as string;

    return (
        <div className="space-y-6">
            <ReportBuilder reportId={reportId} />
        </div>
    );
}