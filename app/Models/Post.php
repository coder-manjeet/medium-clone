<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'subtitle',
        'content',
        'slug',
        'published_at',
        'claps_count',
    ];

    protected $casts = [
        'content' => 'json',
        'published_at' => 'datetime',
    ];

    /**
     * Get the user that owns the post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the comments for the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the tags associated with the post.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tag');
    }

    /**
     * Get the claps for the post.
     */
    public function claps(): HasMany
    {
        return $this->hasMany(Clap::class);
    }

    /**
     * Get the publications this post belongs to.
     */
    public function publications(): BelongsToMany
    {
        return $this->belongsToMany(Publication::class, 'post_publication');
    }

    /**
     * Get all users who clapped this post.
     */
    public function clappers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'claps')
            ->withPivot('count')
            ->withTimestamps();
    }
}
