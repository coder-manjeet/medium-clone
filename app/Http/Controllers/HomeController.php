<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with initial data.
     */
    public function index(Request $request)
    {
        return Inertia::render('home', [
            'initialForYouPosts' => $this->getForYouPosts($request, 1),
            'initialFeaturedPosts' => $this->getFeaturedPosts($request, 1),
        ]);
    }

    /**
     * Get recommended posts for the "For You" tab.
     */
    public function forYou(Request $request)
    {
        $page = $request->input('page', 1);
        return response()->json($this->getForYouPosts($request, $page));
    }

    /**
     * Get posts from followed publications for the "Featured" tab.
     */
    public function featured(Request $request)
    {
        $page = $request->input('page', 1);
        return response()->json($this->getFeaturedPosts($request, $page));
    }

    /**
     * Get paginated posts for "For You" feed.
     */
    private function getForYouPosts(Request $request, int $page)
    {
        $perPage = 10;
        
        /** @var User $user */
        $user = $request->user();

        // Get posts based on user's interests (tags they've interacted with)
        // For now, we'll get recent published posts with author and tags
        $posts = Post::with(['author:id,name', 'tags:id,name,slug'])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $posts->items(),
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
            'has_more' => $posts->hasMorePages(),
        ];
    }

    /**
     * Get paginated posts from followed publications.
     */
    private function getFeaturedPosts(Request $request, int $page)
    {
        $perPage = 10;
        
        /** @var User $user */
        $user = $request->user();

        // Get publications the user follows
        $followedPublicationIds = $user->follows()
            ->where('followable_type', 'App\\Models\\Publication')
            ->pluck('followable_id');

        // Get posts from those publications
        $posts = Post::with(['author:id,name', 'tags:id,name,slug', 'publications:id,name'])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->whereHas('publications', function ($query) use ($followedPublicationIds) {
                $query->whereIn('publications.id', $followedPublicationIds);
            })
            ->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $posts->items(),
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
            'has_more' => $posts->hasMorePages(),
        ];
    }
}
