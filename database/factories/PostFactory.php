<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'subtitle' => fake()->sentence(10),
            'content' => json_encode([
                'blocks' => [
                    [
                        'type' => 'paragraph',
                        'data' => [
                            'text' => fake()->paragraph(),
                        ],
                    ],
                ],
            ]),
            'slug' => fake()->unique()->slug(),
            'published_at' => fake()->dateTimeThisYear(),
            'claps_count' => fake()->numberBetween(0, 1000),
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now(),
        ]);
    }
}
