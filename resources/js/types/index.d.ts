import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    followingUsers: User[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    cover_image_url?: string;
    bio?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Publication {
    id: number;
    name: string;
    description?: string;
}

export interface Post {
    id: number;
    user_id: number;
    title: string;
    subtitle?: string;
    content: Record<string, unknown>; // JSON content
    slug: string;
    published_at: string | null;
    claps_count: number;
    created_at: string;
    updated_at: string;
    author?: User;
    tags?: Tag[];
    publications?: Publication[];
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
}

