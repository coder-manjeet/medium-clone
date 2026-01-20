import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookMarked,
    FileText,
    Home,
    Plus,
    User as UserIcon,
    Users,
} from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import {
    following,
    library,
    profile,
    stats,
    stories,
} from '@/routes';
import { type User } from '@/types';

import AppLogo from './app-logo';

interface AppSidebarProps {
    followingUsers?: User[];
}

export function AppSidebar({ followingUsers = [] }: AppSidebarProps) {
    const { urlIsActive } = useActiveUrl();

    const mainNavItems = [
        {
            title: 'Home',
            href: '/home',
            icon: Home,
        },
        {
            title: 'Library',
            href: library().url,
            icon: BookMarked,
        },
        {
            title: 'Profile',
            href: profile().url,
            icon: UserIcon,
        },
        {
            title: 'Stories',
            href: stories().url,
            icon: FileText,
        },
        {
            title: 'Stats',
            href: stats().url,
            icon: BarChart3,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/home" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-2">
                    <SidebarMenu>
                        {mainNavItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={urlIsActive(item.href)}
                                    tooltip={{ children: item.title }}
                                    size="lg"
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator  className='max-w-[224px]'/>

                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>Following</SidebarGroupLabel>
                    <SidebarMenu>
                        {followingUsers.slice(0, 5).map((user) => (
                            <SidebarMenuItem key={user.id}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: user.name }}
                                >
                                    <Link
                                        href={`/users/${user.id}`}
                                        prefetch
                                    >
                                        <Users className="h-10 w-10" />
                                        <span>{user.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(following().url)}
                                tooltip={{
                                    children:
                                        'Find writers and publications to follow',
                                }}
                                size="lg"
                                className='h-auto bg-transparent'
                            >
                                <Link href={following().url} prefetch>
                                    <Plus className="h-10 w-10" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs">
                                            Find writers and publications to
                                            follow.
                                        </span>
                                        <span className="text-xs text-primary underline">
                                            See suggestions
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
