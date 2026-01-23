import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PostCard } from '@/components/post-card';
import type { PaginatedResponse, Post } from '@/types';

interface InfiniteScrollFeedProps {
    initialData: PaginatedResponse<Post>;
    fetchUrl: string;
    key?: string;
}

export function InfiniteScrollFeed({ initialData, fetchUrl, key }: InfiniteScrollFeedProps) {
    const [posts, setPosts] = useState<Post[]>(initialData.data);
    const [currentPage, setCurrentPage] = useState(initialData.current_page);
    const [hasMore, setHasMore] = useState(initialData.has_more);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await axios.get<PaginatedResponse<Post>>(fetchUrl, {
                params: { page: currentPage + 1 },
            });

            const newData = response.data;
            setPosts((prev) => [...prev, ...newData.data]);
            setCurrentPage(newData.current_page);
            setHasMore(newData.has_more);
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, fetchUrl, currentPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoading, loadMore]);

    // Reset when key changes (tab switch)
    useEffect(() => {
        setPosts(initialData.data);
        setCurrentPage(initialData.current_page);
        setHasMore(initialData.has_more);
        setIsLoading(false);
    }, [key]);

    if (posts.length === 0 && !isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">No posts yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Check back later for new content
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="divide-y divide-border">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Intersection observer target */}
            <div ref={observerTarget} className="py-8">
                {isLoading && (
                    <div className="flex justify-center">
                        <div className="text-sm text-muted-foreground">Loading more posts...</div>
                    </div>
                )}
                {!hasMore && posts.length > 0 && (
                    <div className="flex justify-center">
                        <div className="text-sm text-muted-foreground">No more posts to load</div>
                    </div>
                )}
            </div>
        </div>
    );
}

