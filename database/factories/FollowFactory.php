<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Publication;
use Illuminate\Database\Eloquent\Factories\Factory;

class FollowFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'followable_id' => User::factory(),
            'followable_type' => User::class,
        ];
    }

    public function followPublication(): static
    {
        return $this->state(fn (array $attributes) => [
            'followable_id' => Publication::factory(),
            'followable_type' => Publication::class,
        ]);
    }

    public function followUser(): static
    {
        return $this->state(fn (array $attributes) => [
            'followable_id' => User::factory(),
            'followable_type' => User::class,
        ]);
    }
}
