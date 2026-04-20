"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, DollarSign, Users } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Plano Atual
                    </CardTitle>
                    <CardDescription>
                        Gerencie seu plano e métodos de pagamento
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold text-lg">Plano Gratuito</h3>
                            <p className="text-sm text-muted-foreground">
                                Acesso básico com limites mensais
                            </p>
                        </div>
                        <Badge variant="secondary">Atual</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <DollarSign className="h-8 w-8 text-primary mb-2" />
                                <p className="text-2xl font-bold">R$ 0</p>
                                <p className="text-sm text-muted-foreground">por mês</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <Calendar className="h-8 w-8 text-primary mb-2" />
                                <p className="text-2xl font-bold">100</p>
                                <p className="text-sm text-muted-foreground">análises/mês</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <Users className="h-8 w-8 text-primary mb-2" />
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-sm text-muted-foreground">membros</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end">
                        <Button>Fazer upgrade</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}