import { Head, Link, usePage } from '@inertiajs/react';
import { MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';

import { InfiniteScrollFeed } from '@/components/infinite-scroll-feed';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResponse,
    type Post,
    type User,
    type Publication,
} from '@/types';

interface PageProps {
    auth: {
        user: User;
    };
}

interface ProfileProps {
    profileUser: User;
    followersCount: number;
    following: User[];
    isFollowing: boolean;
    publications: Publication[];
    initialPosts: PaginatedResponse<Post>;
}

export default function Profile({
    profileUser,
    followersCount = 0,
    following = [],
    isFollowing = false,
    publications = [],
    initialPosts,
}: ProfileProps) {
    const { auth } = usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState('home');
    const [isUserFollowing, setIsUserFollowing] = useState(isFollowing);

    // Handle missing profileUser
    if (!profileUser) {
        return (
            <AppLayout>
                <Head title="Profile Not Found" />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                            Profile Not Found
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            The user profile you're looking for doesn't exist.
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const isOwnProfile = auth?.user?.id === profileUser.id;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: profileUser.name,
            href: `/@${profileUser.name}`,
        },
    ];

    const avatarInitials = profileUser.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || '?';

    const handleFollowClick = () => {
        // TODO: Implement follow/unfollow action
        setIsUserFollowing(!isUserFollowing);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${profileUser.name}'s Profile`} />
            <div className="flex flex-1 flex-col gap-4 overflow-x-auto">
                {/* Main Grid Layout */}
                <div className="relative grid auto-rows-min gap-4 md:grid-cols-100 overflow-hidden px-4 pt-4">
                    {/* Left Sidebar - Empty */}
                    <div className="relative h-[80vh] w-auto overflow-hidden col-span-16" />

                    {/* Center Content */}
                    <div className="relative w-auto overflow-hidden col-span-50">
                        {/* Profile Header */}
                        <div className="mb-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                            {/* Cover Image */}
                            <div
                                className="mb-4 h-48 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center"
                                style={
                                    profileUser.cover_image_url
                                        ? { backgroundImage: `url(${profileUser.cover_image_url})` }
                                        : {}
                                }
                            />

                            {/* Profile Info */}
                            <div className="flex items-start justify-between">
                                <div className="flex flex-1 items-end gap-4">
                                    {/* Avatar */}
                                    <Avatar className="h-28 w-28 -mt-14 border-4 border-white dark:border-neutral-950">
                                        <AvatarImage src={profileUser.avatar_url} alt={profileUser.name} />
                                        <AvatarFallback className="text-xl">
                                            {avatarInitials}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="pb-2">
                                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                            {profileUser.name}
                                        </h1>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            he/him
                                        </p>
                                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                                            {followersCount} followers
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {isOwnProfile ? (
                                        <>
                                            <Link href="/settings/profile">
                                                <Button variant="outline" size="sm">
                                                    Edit profile
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                size="sm"
                                                variant={isUserFollowing ? 'outline' : 'default'}
                                                onClick={handleFollowClick}
                                            >
                                                {isUserFollowing ? 'Following' : 'Follow'}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="px-2">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="px-2">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {profileUser.bio && (
                                <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
                                    {profileUser.bio}
                                </p>
                            )}
                        </div>

                        {/* Tabs Navigation */}
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="bg-transparent border-b border-neutral-200 dark:border-neutral-800 rounded-none">
                                <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent py-4">
                                    Home
                                </TabsTrigger>
                                <TabsTrigger value="lists" className="rounded-none border-b-2 border-transparent py-4">
                                    Lists
                                </TabsTrigger>
                                <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent py-4">
                                    About
                                </TabsTrigger>
                            </TabsList>

                            {/* Home Tab - Posts */}
                            <TabsContent value="home" className="mt-0">
                                <InfiniteScrollFeed
                                    key="profile-posts"
                                    initialData={initialPosts}
                                    fetchUrl={`/@${profileUser.name}/posts`}
                                />
                            </TabsContent>

                            {/* Lists Tab */}
                            <TabsContent value="lists" className="mt-6">
                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        No lists yet
                                    </p>
                                </div>
                            </TabsContent>

                            {/* About Tab */}
                            <TabsContent value="about" className="mt-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                                        About
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {profileUser.bio || 'No bio provided'}
                                    </p>
                                </div>

                                {publications.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
                                            Publications
                                        </h3>
                                        <div className="space-y-2">
                                            {publications.map((pub) => (
                                                <div
                                                    key={pub.id}
                                                    className="rounded border border-neutral-200 p-3 dark:border-neutral-800"
                                                >
                                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                                                        {pub.name}
                                                    </h4>
                                                    {pub.description && (
                                                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                                            {pub.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                                        Joined
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {new Date(profileUser.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar */}
                    <div className="relative overflow-hidden col-span-34 space-y-6">
                        {/* Following Section */}
                        {following.length > 0 && (
                            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                                <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                    Following
                                </h3>
                                <div className="space-y-3">
                                    {following.map((user) => (
                                        <Link
                                            key={user.id}
                                            href={`/@${user.name}`}
                                            className="flex items-center gap-3 hover:opacity-75"
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                                <AvatarFallback>
                                                    {user.name
                                                        ?.split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                                                    {user.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {following.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="mt-4 w-full text-xs"
                                    >
                                        See all ({followersCount})
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Publications Section */}
                        {publications.length > 0 && (
                            <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                                <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                    Publications
                                </h3>
                                <div className="space-y-3">
                                    {publications.map((pub) => (
                                        <div
                                            key={pub.id}
                                            className="rounded bg-neutral-50 p-3 dark:bg-neutral-900"
                                        >
                                            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-50">
                                                {pub.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
