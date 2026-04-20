"use client";

import { useState } from "react";
import FileUpload from "@/components/upload/FileUpload";
import DataPreview from "@/components/upload/DataPreview";
import DataAnalyzer from "@/components/analytics/DataAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function UploadPage() {
    const { data: session } = useSession();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedData, setUploadedData] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleFileUploaded = async (file: File, data: any[]) => {
        setUploadedFile(file);
        setUploadedData(data);

        // Aqui você normalmente salvaria no banco de dados
        // Por enquanto, vamos apenas simular o processamento
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
        }, 2000);
    };

    const columns = uploadedData.length > 0
        ? Object.keys(uploadedData[0])
        : [];

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Enviar Dados</h1>
                <p className="text-muted-foreground">
                    Envie arquivos CSV ou Excel para análise
                </p>
            </div>

            <Tabs defaultValue="upload" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Enviar
                    </TabsTrigger>
                    <TabsTrigger
                        value="preview"
                        className="flex items-center gap-2"
                        disabled={!uploadedData.length}
                    >
                        <Database className="h-4 w-4" />
                        Visualizar
                    </TabsTrigger>
                    <TabsTrigger
                        value="analyze"
                        className="flex items-center gap-2"
                        disabled={!uploadedData.length}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Analisar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Envie Seus Dados</CardTitle>
                            <CardDescription>
                                Envie arquivos CSV ou Excel para análise. Os arquivos devem conter dados estruturados.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileUpload onFileUploaded={handleFileUploaded} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Diretrizes de Envio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Formatos Suportados</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• CSV (.csv) - Valores separados por vírgula</li>
                                        <li>• Excel (.xlsx, .xls) - Microsoft Excel</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Requisitos</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Tamanho máximo do arquivo: 10MB</li>
                                        <li>• A primeira linha deve conter cabeçalhos</li>
                                        <li>• Os dados devem estar em formato tabular</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preview">
                    {uploadedData.length > 0 ? (
                        <DataPreview
                            data={uploadedData}
                            fileName={uploadedFile?.name || "dados"}
                            rowCount={uploadedData.length}
                            columns={columns}
                        />
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Nenhum Dado Disponível</CardTitle>
                                <CardDescription>Por favor, envie um arquivo primeiro</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="analyze">
                    {uploadedData.length > 0 ? (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ferramentas de Análise de Dados</CardTitle>
                                    <CardDescription>
                                        Analise seus dados enviados com várias ferramentas analíticas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DataAnalyzer
                                        data={uploadedData}
                                        columns={columns}
                                    />
                                </CardContent>
                            </Card>

                            {/* Resumo Estatístico */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Estatísticas Rápidas</CardTitle>
                                    <CardDescription>
                                        Estatísticas básicas sobre seus dados enviados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-600">Total de Linhas</p>
                                            <p className="text-2xl font-bold">{uploadedData.length}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-600">Total de Colunas</p>
                                            <p className="text-2xl font-bold">{columns.length}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-600">Tamanho do Arquivo</p>
                                            <p className="text-2xl font-bold">
                                                {(uploadedFile?.size ? uploadedFile.size / 1024 : 0).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-600">Tipo de Arquivo</p>
                                            <p className="text-2xl font-bold">
                                                {uploadedFile?.name.split('.').pop()?.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Nenhum Dado Disponível</CardTitle>
                                <CardDescription>Por favor, envie um arquivo primeiro</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}