import { Head } from '@inertiajs/react';

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-[80vh] flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="relative grid auto-rows-min gap-4 md:grid-cols-100 overflow-hidden ">
                    <div className="relative h-[80vh] w-auto overflow-hidden dark:border-sidebar-border start col-span-16">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative h-[80vh] w-auto overflow-hidden dark:border-sidebar-border start col-span-50">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative overflow-hidden dark:border-sidebar-border start col-span-34">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
