<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Follow extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'followable_id',
        'followable_type',
    ];

    /**
     * Get the user that performed the follow action.
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the followable model (User or Publication).
     */
    public function followable(): MorphTo
    {
        return $this->morphTo();
    }
}
