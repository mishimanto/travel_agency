<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationsSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Bali, Indonesia',
                'description' => 'Known as the Island of Gods, Bali is famous for its volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.',
                'images' => json_encode(['bali-1.jpg', 'bali-2.jpg', 'bali-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Kyoto, Japan',
                'description' => 'Once the capital of Japan, Kyoto is known for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
                'images' => json_encode(['kyoto-1.jpg', 'kyoto-2.jpg', 'kyoto-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Paris, France',
                'description' => 'The City of Light is famous for its cafe culture, the Eiffel Tower, the Louvre Museum, Notre-Dame cathedral, and the Champs-Élysées.',
                'images' => json_encode(['paris-1.jpg', 'paris-2.jpg', 'paris-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'New York, USA',
                'description' => 'The Big Apple is known for its iconic landmarks like Times Square, Central Park, the Empire State Building, and Broadway shows.',
                'images' => json_encode(['nyc-1.jpg', 'nyc-2.jpg', 'nyc-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Sydney, Australia',
                'description' => 'Famous for its harborfront Sydney Opera House and the Sydney Harbour Bridge. Its beaches include Bondi and Manly.',
                'images' => json_encode(['sydney-1.jpg', 'sydney-2.jpg', 'sydney-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Cape Town, South Africa',
                'description' => 'A port city on South Africa\'s southwest coast, on a peninsula beneath the imposing Table Mountain.',
                'images' => json_encode(['capetown-1.jpg', 'capetown-2.jpg', 'capetown-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Dubai, UAE',
                'description' => 'Known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Burj Khalifa dominates the skyscraper-filled skyline.',
                'images' => json_encode(['dubai-1.jpg', 'dubai-2.jpg', 'dubai-3.jpg']),
                'is_active' => true,
            ],
            [
                'name' => 'Rome, Italy',
                'description' => 'The Eternal City is known for its ancient ruins like the Colosseum and Roman Forum, Vatican City, and delicious Italian cuisine.',
                'images' => json_encode(['rome-1.jpg', 'rome-2.jpg', 'rome-3.jpg']),
                'is_active' => true,
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}