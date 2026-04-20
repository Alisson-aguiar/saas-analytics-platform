"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { reportService, Report, CreateReportDTO } from "@/lib/services/reports/report.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useReport(reportId?: string) {
    const { data: session } = useSession();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (reportId) {
            loadReport();
        } else {
            setLoading(false);
        }
    }, [reportId]);

    const loadReport = async () => {
        if (!reportId) return;

        try {
            setLoading(true);
            const data = await reportService.getReportById(reportId);
            setReport(data);
        } catch (err) {
            setError("Erro ao carregar relatório");
        } finally {
            setLoading(false);
        }
    };

    const createReport = async (data: CreateReportDTO) => {
        if (!session?.user?.id) {
            setError("Usuário não autenticado");
            return null;
        }

        try {
            setSaving(true);
            const newReport = await reportService.createReport(session.user.id, data);

            if (newReport) {
                toast.success("Relatório criado com sucesso!");
            }

            return newReport;
        } catch (err) {
            setError("Erro ao criar relatório");
            toast.error("Erro ao criar relatório");
            return null;
        } finally {
            setSaving(false);
        }
    };

    const updateReport = async (data: Partial<CreateReportDTO>) => {
        if (!report?.id) return false;

        try {
            setSaving(true);
            const success = await reportService.updateReport(report.id, data);

            if (success) {
                await loadReport();
                toast.success("Relatório atualizado com sucesso!");
            }

            return success;
        } catch (err) {
            setError("Erro ao atualizar relatório");
            toast.error("Erro ao atualizar relatório");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const deleteReport = async () => {
        if (!report?.id) return false;

        try {
            setSaving(true);
            const success = await reportService.deleteReport(report.id);

            if (success) {
                toast.success("Relatório deletado com sucesso!");
            }

            return success;
        } catch (err) {
            setError("Erro ao deletar relatório");
            toast.error("Erro ao deletar relatório");
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
        report,
        loading,
        saving,
        error,
        createReport,
        updateReport,
        deleteReport,
        refresh: loadReport
    };
}