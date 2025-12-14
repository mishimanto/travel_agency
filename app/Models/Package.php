<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'offer_price',
        'duration_days',
        'destination_id',
        'available_dates',
        'image',
        'inclusions',
        'itinerary',
        'is_featured',
        'is_active'
    ];

    protected $casts = [
        'available_dates' => 'array',
        'inclusions' => 'array',
        'itinerary' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}