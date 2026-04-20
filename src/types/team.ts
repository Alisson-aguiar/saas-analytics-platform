export interface Team {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    memberCount?: number;
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
    user: {
        email: string;
        name: string;
        avatar?: string;
    };
}

export interface Invitation {
    id: string;
    teamId: string;
    email: string;
    role: 'admin' | 'member';
    token: string;
    status: 'pending' | 'accepted' | 'expired';
    expiresAt: Date;
    createdAt: Date;
}

export type MemberRole = 'owner' | 'admin' | 'member';