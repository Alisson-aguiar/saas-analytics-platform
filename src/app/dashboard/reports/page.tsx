"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, FileText, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { reportService, Report } from "@/lib/services/reports/report.service";

export default function ReportsPage() {
    const { data: session } = useSession();
    const [myReports, setMyReports] = useState<Report[]>([]);
    const [publicReports, setPublicReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReports = async () => {
            if (!session?.user?.id) return;

            try {
                const [my, public_] = await Promise.all([
                    reportService.getUserReports(session.user.id),
                    reportService.getPublicReports()
                ]);

                setMyReports(my);
                setPublicReports(public_);
            } catch (error) {
                console.error("Erro ao carregar relatórios:", error);
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, [session?.user?.id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
                    <p className="text-muted-foreground">
                        Crie, visualize e compartilhe relatórios personalizados
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/reports/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Relatório
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="mine" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="mine" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Meus Relatórios ({myReports.length})
                    </TabsTrigger>
                    <TabsTrigger value="public" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Públicos ({publicReports.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="mine" className="space-y-4">
                    {myReports.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium">Nenhum relatório ainda</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Crie seu primeiro relatório para começar
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/reports/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar Relatório
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myReports.map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="public">
                    {publicReports.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-lg font-medium">Nenhum relatório público</p>
                                <p className="text-sm text-gray-500">
                                    Quando você tornar um relatório público, ele aparecerá aqui
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {publicReports.map((report) => (
                                <ReportCard key={report.id} report={report} showAuthor />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ReportCard({ report, showAuthor = false }: { report: Report; showAuthor?: boolean }) {
    return (
        <Link href={`/dashboard/reports/${report.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        {report.isPublic && (
                            <Badge variant="secondary" className="ml-2">Público</Badge>
                        )}
                    </div>
                    <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDistanceToNow(new Date(report.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                            })}
                        </div>
                        {showAuthor && (
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {report.userName}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex gap-2">
                        <Badge variant="outline">{report.config?.type || 'Personalizado'}</Badge>
                        <Badge variant="outline">{report.config?.charts?.length || 0} gráficos</Badge>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}