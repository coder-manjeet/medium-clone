import { Link } from '@inertiajs/react';
import { Bookmark, MoreHorizontal, Share } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Post } from '@/types';

import { PlaceholderPattern } from './ui/placeholder-pattern';

interface PostCardProps {
    post: Post;
}

// Simple time ago formatter
function timeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval);
        if (interval >= 1) {
            return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

export function PostCard({ post }: PostCardProps) {
    const author = post.author;
    const publishedDate = post.published_at ? timeAgo(post.published_at) : '';

    // Get initials for avatar fallback
    const initials =
        author?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';

    return (
        <article className="group flex gap-6 items-center border-b border-border py-8 last:border-0">
            {/* Left content */}
            <div className="flex flex-1 flex-col gap-2 md:mr-6">
                {/* Author info */}
                <div className="flex items-center gap-2 mb-2">
                    <Link href={`/profile/${author?.id}`}>
                        <Avatar className="size-6">
                            <AvatarFallback className="bg-neutral-200 text-xs font-semibold text-black dark:bg-neutral-700 dark:text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link
                        href={`/profile/${author?.id}`}
                        className="text-sm font-medium hover:underline"
                    >
                        {author?.name}
                    </Link>
                </div>

                {/* Post title and content */}
                <Link href={`/posts/${post.slug}`} className="group/link">
                    <h2 className="text-2xl leading-tight font-extrabold">
                        {post.title}
                    </h2>
                    {post.subtitle && (
                        <p className="mt-1 line-clamp-2 text-muted-foreground">
                            {post.subtitle}
                        </p>
                    )}
                </Link>

                {/* Meta info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <time dateTime={post.published_at || ''}>
                            {publishedDate}
                        </time>
                        {post.tags && post.tags.length > 0 && (
                            <>
                                <span>·</span>
                                <div className="flex gap-2">
                                    {post.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}
                        {post.claps_count > 0 && (
                            <>
                                <span>·</span>
                                <span>👏 {post.claps_count}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="size-10">
                            <Bookmark className="size-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="size-10">
                            <Share className="size-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="size-10">
                            <MoreHorizontal className="size-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </div>
                </div>
            </div>

            <PlaceholderPattern className="inset-0 aspect-video w-40 h-30 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </article>
    );
}
