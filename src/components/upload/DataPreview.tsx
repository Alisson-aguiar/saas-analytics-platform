"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Download, Filter, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DataPreviewProps {
  data: any[];
  fileName: string;
  rowCount: number;
  columns: string[];
}

export default function DataPreview({ data, fileName, rowCount, columns }: DataPreviewProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);
  const [previewRows, setPreviewRows] = useState(10);

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum Dado Disponível</CardTitle>
          <CardDescription>Envie um arquivo para visualizar os dados</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleExport = () => {
    const csv = [
      selectedColumns.join(","),
      ...data.slice(0, previewRows).map(row =>
        selectedColumns.map(col => row[col] || "").join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_preview.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Visualização de Dados</h3>
          <p className="text-sm text-gray-500">
            {rowCount} linhas × {columns.length} colunas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewRows(prev => prev + 10)}>
            Carregar Mais Linhas
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Visualização
          </Button>
        </div>
      </div>

      {/* Seletor de Colunas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Colunas</CardTitle>
            <Badge variant="secondary">
              {selectedColumns.length} de {columns.length} selecionadas
            </Badge>
          </div>
          <CardDescription>Selecione as colunas para exibir na visualização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {columns.map(column => (
              <Badge
                key={column}
                variant={selectedColumns.includes(column) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleColumnToggle(column)}
              >
                {column}
                {selectedColumns.includes(column) && (
                  <span className="ml-1">✓</span>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Dados */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                {selectedColumns.map(column => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, previewRows).map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  {selectedColumns.map(column => (
                    <TableCell key={column}>
                      {row[column] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Linhas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rowCount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Colunas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{columns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Linhas em Visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.min(previewRows, rowCount).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}