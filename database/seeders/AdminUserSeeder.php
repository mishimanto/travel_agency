<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('shimanto'),
            'phone' => '019XXXXXXXX',
            'address' => 'xyz, Admin City',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Create Regular User
        User::create([
            'name' => 'Test User',
            'email' => 'test@gmail.com',
            'password' => Hash::make('shimanto'),
            'phone' => '017XXXXXXXX',
            'address' => 'XYZ, User City',
            'is_admin' => false,
            'email_verified_at' => now(),
        ]);

    }
}
