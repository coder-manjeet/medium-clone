<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\Publication;
use App\Models\Clap;
use App\Models\Follow;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create additional users
        $users = User::factory(9)->create();
        $allUsers = collect([$testUser])->merge($users);

        // Create tags
        $tags = Tag::factory(10)->create();

        // Create publications
        $publications = Publication::factory(3)
            ->recycle($allUsers)
            ->create();

        // Create posts
        $posts = Post::factory(20)
            ->recycle($allUsers)
            ->published()
            ->create();

        // Attach tags to posts (many-to-many)
        foreach ($posts as $post) {
            $post->tags()->attach(
                $tags->random(rand(1, 5))->pluck('id')->toArray()
            );
        }

        // Attach posts to publications (many-to-many)
        foreach ($publications as $publication) {
            $publication->posts()->attach(
                $posts->random(rand(3, 8))->pluck('id')->toArray()
            );
        }

        // Create comments
        Comment::factory(50)
            ->recycle([$posts, $allUsers])
            ->create();

        // Create comment replies
        Comment::factory(30)
            ->recycle([$posts, $allUsers])
            ->create(function (array $attributes) {
                return [
                    'parent_id' => Comment::inRandomOrder()->first()->id,
                ];
            });

        // Create claps (ensure no duplicate claps per user per post)
        foreach ($posts as $post) {
            // Get random number of unique users to clap this post
            $clapCount = rand(5, min(10, $allUsers->count()));
            $usersToClap = $allUsers->random($clapCount);
            
            foreach ($usersToClap as $user) {
                Clap::factory()->create([
                    'post_id' => $post->id,
                    'user_id' => $user->id,
                    'count' => rand(1, 50),
                ]);
            }
        }

        // Create follows
        foreach ($allUsers as $user) {
            // Follow random users
            $followingUsers = $allUsers->except($user->id)->random(rand(2, 5));
            foreach ($followingUsers as $userToFollow) {
                Follow::factory()->create([
                    'user_id' => $user->id,
                    'followable_id' => $userToFollow->id,
                    'followable_type' => User::class,
                ]);
            }

            // Follow random publications
            $randomPublications = $publications->random(rand(1, 3));
            foreach ($randomPublications as $publication) {
                Follow::factory()->create([
                    'user_id' => $user->id,
                    'followable_id' => $publication->id,
                    'followable_type' => Publication::class,
                ]);
            }
        }
    }
}
