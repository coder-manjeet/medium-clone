<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
    ];

    /**
     * Get the user who owns the publication.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the posts in this publication.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_publication');
    }

    /**
     * Get all the follows for this publication.
     */
    public function followers(): MorphMany
    {
        return $this->morphMany(Follow::class, 'followable');
    }
}
