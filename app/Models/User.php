<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the posts written by the user.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    /**
     * Get the comments written by the user.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'user_id');
    }

    /**
     * Get the claps given by the user.
     */
    public function claps(): HasMany
    {
        return $this->hasMany(Clap::class);
    }

    /**
     * Get the posts clapped by the user.
     */
    public function clappedPosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'claps')
            ->withPivot('count')
            ->withTimestamps();
    }

    /**
     * Get the publications owned by the user.
     */
    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class, 'owner_id');
    }

    /**
     * Get all follows by this user.
     */
    public function follows(): HasMany
    {
        return $this->hasMany(Follow::class, 'user_id');
    }

    /**
     * Get all users this user follows.
     */
    public function followingUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'user_id', 'followable_id')
            ->where('follows.followable_type', User::class)
            ->withTimestamps();
    }

    /**
     * Get all publications this user follows.
     */
    public function followingPublications(): BelongsToMany
    {
        return $this->belongsToMany(Publication::class, 'follows', 'user_id', 'followable_id')
            ->where('follows.followable_type', Publication::class)
            ->withTimestamps();
    }

    /**
     * Get all follows for this user (people following this user).
     */
    public function followers(): MorphMany
    {
        return $this->morphMany(Follow::class, 'followable');
    }
}
