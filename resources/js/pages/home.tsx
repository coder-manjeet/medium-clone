import { Head } from '@inertiajs/react';
import { useState } from 'react';

import { InfiniteScrollFeed } from '@/components/infinite-scroll-feed';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResponse,
    type Post,
} from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

interface HomeProps {
    initialForYouPosts: PaginatedResponse<Post>;
    initialFeaturedPosts: PaginatedResponse<Post>;
}

export default function Home({
    initialForYouPosts,
    initialFeaturedPosts,
}: HomeProps) {
    const [activeTab, setActiveTab] = useState('for-you');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
             <div className="flex h-[80vh] flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="relative grid auto-rows-min gap-4 md:grid-cols-100 overflow-hidden ">
                    <div className="relative h-[80vh] w-auto overflow-hidden dark:border-sidebar-border start col-span-16">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                    <div className="relative w-auto overflow-hidden dark:border-sidebar-border start col-span-50">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className='bg-transparent'>
                                <TabsTrigger value="for-you" className='rounded-0 py-5'>
                                    For you
                                </TabsTrigger>
                                <TabsTrigger value="featured" className='rounded-0 py-5'>
                                    Featured
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="for-you" className="mt-0">
                                <InfiniteScrollFeed
                                    key="for-you"
                                    initialData={initialForYouPosts}
                                    fetchUrl="/home/for-you"
                                />
                            </TabsContent>

                            <TabsContent value="featured" className="mt-0">
                                <InfiniteScrollFeed
                                    key="featured"
                                    initialData={initialFeaturedPosts}
                                    fetchUrl="/home/featured"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="relative overflow-hidden dark:border-sidebar-border start col-span-34">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
