"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Column {
    key: string;
    label: string;
    format?: (value: any, index?: number) => string | React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    title: string;
}

export default function DataTable({ data, columns, title }: DataTableProps) {
    const formatValue = (value: any, format?: (value: any, index?: number) => string | React.ReactNode, index?: number) => {
        if (format) return format(value, index);
        if (typeof value === 'number') return value.toLocaleString();
        if (value instanceof Date) return value.toLocaleDateString('pt-BR');
        return value || '-';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableHead key={`${col.key}-${index}`}>
                                        {col.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                        Nenhum dado disponível
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <TableRow key={`row-${rowIndex}`}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                                                {formatValue(row[col.key], col.format, rowIndex)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}