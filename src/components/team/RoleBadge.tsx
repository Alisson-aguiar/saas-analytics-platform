import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User } from "lucide-react";

interface RoleBadgeProps {
    role: 'owner' | 'admin' | 'member';
}

export function RoleBadge({ role }: RoleBadgeProps) {
    const config = {
        owner: {
            icon: Crown,
            label: 'Proprietário',
            className: 'bg-amber-100 text-amber-700 border-amber-200',
        },
        admin: {
            icon: Shield,
            label: 'Administrador',
            className: 'bg-blue-100 text-blue-700 border-blue-200',
        },
        member: {
            icon: User,
            label: 'Membro',
            className: 'bg-gray-100 text-gray-700 border-gray-200',
        },
    };

    const { icon: Icon, label, className } = config[role];

    return (
        <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}