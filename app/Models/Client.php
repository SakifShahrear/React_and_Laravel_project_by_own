<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'occupation',
        'password',
        'image',
    ];

    protected $hidden = [
        'password',
    ];

    protected $appends = [
        'image_url'
    ];

    /**
     * Get the image URL attribute
     */
    public function getImageUrlAttribute()
    {
        return $this->image ? url('storage/' . $this->image) : null;
    }
}
