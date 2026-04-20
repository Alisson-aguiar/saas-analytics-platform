"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRange {
    from: Date;
    to: Date;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handlePresetSelect = (preset: string) => {
        const today = new Date();
        let from = new Date();
        let to = today;

        switch (preset) {
            case "7":
                from.setDate(today.getDate() - 7);
                break;
            case "30":
                from.setDate(today.getDate() - 30);
                break;
            case "90":
                from.setDate(today.getDate() - 90);
                break;
        }

        onChange({ from, to });
    };

    return (
        <div className="grid gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "dd/MM/yyyy")} -{" "}
                                    {format(value.to, "dd/MM/yyyy")}
                                </>
                            ) : (
                                format(value.from, "dd/MM/yyyy")
                            )
                        ) : (
                            <span>Selecione um período</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                        <Select onValueChange={handlePresetSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Período predefinido" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Últimos 7 dias</SelectItem>
                                <SelectItem value="30">Últimos 30 dias</SelectItem>
                                <SelectItem value="90">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Calendar
                        mode="range"
                        selected={value}
                        onSelect={(range: any) => {
                            if (range?.from && range?.to) {
                                onChange(range);
                                setIsOpen(false);
                            }
                        }}
                        numberOfMonths={2}
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}