<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the current authenticated user's profile.
     */
    public function showCurrentUser(Request $request)
    {
        $user = $request->user();
        return $this->show($request, $user);
    }

    /**
     * Display the user's profile page.
     */
    public function show(Request $request, User $user)
    {
        // Get user's published posts with pagination
        $perPage = 10;
        $page = $request->input('page', 1);

        $posts = Post::where('user_id', $user->id)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with(['author:id,name,avatar_url', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page);

        // Get user's followers count
        $followersCount = $user->followers()->count();

        // Get users that this user is following
        $following = $user->follows()
            ->where('followable_type', User::class)
            ->with('followable:id,name,avatar_url')
            ->limit(5)
            ->get()
            ->map(fn($follow) => $follow->followable);

        // Check if current user follows this user
        $isFollowing = false;
        $currentUser = $request->user();
        if ($currentUser) {
            $isFollowing = $currentUser->follows()
                ->where('followable_type', User::class)
                ->where('followable_id', $user->id)
                ->exists();
        }

        // Get user's publications
        $publications = $user->publications()
            ->limit(5)
            ->get();

        return Inertia::render('profile', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'bio' => $user->bio,
                'avatar_url' => $user->avatar_url,
                'cover_image_url' => $user->cover_image_url,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'followersCount' => $followersCount,
            'following' => $following,
            'isFollowing' => $isFollowing,
            'publications' => $publications,
            'initialPosts' => [
                'data' => $posts->items(),
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'has_more' => $posts->hasMorePages(),
            ],
        ]);
    }

    /**
     * Get user's posts via AJAX.
     */
    public function getPosts(Request $request, User $user)
    {
        $perPage = 10;
        $page = $request->input('page', 1);

        $posts = Post::where('user_id', $user->id)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->with(['author:id,name,avatar_url', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $posts->items(),
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
            'has_more' => $posts->hasMorePages(),
        ]);
    }
}
