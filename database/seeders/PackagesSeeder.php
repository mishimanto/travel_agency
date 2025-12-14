<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Package;
use Illuminate\Database\Seeder;

class PackagesSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = Destination::all();
        
        $packages = [
            [
                'title' => 'Bali Beach Paradise Getaway',
                'description' => '7 days of pure relaxation in Bali\'s most beautiful beaches. Includes luxury accommodation, spa treatments, and island tours.',
                'price' => 1599.99,
                'duration_days' => 7,
                'destination_id' => $destinations->where('name', 'Bali, Indonesia')->first()->id,
                'available_dates' => json_encode(['2024-03-15', '2024-04-10', '2024-05-05', '2024-06-20']),
                'inclusions' => json_encode([
                    'Luxury beachfront villa accommodation',
                    'Daily breakfast buffet',
                    'Airport transfers',
                    'Guided temple tour',
                    'Spa treatment',
                    'Snorkeling equipment',
                    '24/7 concierge service'
                ]),
                'itinerary' => json_encode([
                    ['day' => 1, 'title' => 'Arrival in Bali', 'description' => 'Airport pickup and check-in to your luxury villa'],
                    ['day' => 2, 'title' => 'Ubud Cultural Tour', 'description' => 'Visit temples and traditional markets'],
                    ['day' => 3, 'title' => 'Beach Day', 'description' => 'Relax at Nusa Dua Beach with water sports'],
                    ['day' => 4, 'title' => 'Island Cruise', 'description' => 'Full day cruise to nearby islands'],
                    ['day' => 5, 'title' => 'Spa & Wellness', 'description' => 'Traditional Balinese spa treatments'],
                    ['day' => 6, 'title' => 'Free Day', 'description' => 'Explore at your own pace'],
                    ['day' => 7, 'title' => 'Departure', 'description' => 'Check-out and airport transfer']
                ]),
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Kyoto Cultural Immersion',
                'description' => '10 days exploring the ancient capital of Japan. Experience traditional tea ceremonies, temple stays, and authentic Japanese cuisine.',
                'price' => 2899.99,
                'duration_days' => 10,
                'destination_id' => $destinations->where('name', 'Kyoto, Japan')->first()->id,
                'available_dates' => json_encode(['2024-04-01', '2024-05-15', '2024-09-10', '2024-11-05']),
                'inclusions' => json_encode([
                    'Traditional Ryokan accommodation',
                    'All meals included',
                    'JR Pass for transportation',
                    'Tea ceremony experience',
                    'Kimono rental',
                    'Guided temple tours',
                    'Japanese cooking class'
                ]),
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Paris Romantic Escape',
                'description' => '5 days in the City of Love. Perfect for couples with Eiffel Tower dinner, Seine River cruise, and Louvre Museum tour.',
                'price' => 1299.99,
                'duration_days' => 5,
                'destination_id' => $destinations->where('name', 'Paris, France')->first()->id,
                'available_dates' => json_encode(['2024-02-14', '2024-03-08', '2024-05-20', '2024-06-14']),
                'inclusions' => json_encode([
                    'Boutique hotel in Saint-Germain',
                    'Breakfast daily',
                    'Eiffel Tower dinner reservation',
                    'Seine River cruise tickets',
                    'Louvre Museum skip-the-line pass',
                    'Versailles Palace tour',
                    'Metro passes'
                ]),
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'New York City Adventure',
                'description' => '6 days exploring the Big Apple. Broadway shows, museum visits, and iconic landmark tours.',
                'price' => 1799.99,
                'duration_days' => 6,
                'destination_id' => $destinations->where('name', 'New York, USA')->first()->id,
                'available_dates' => json_encode(['2024-03-20', '2024-04-25', '2024-07-10', '2024-10-05']),
                'inclusions' => json_encode([
                    'Times Square hotel',
                    'Broadway show tickets',
                    'Statue of Liberty cruise',
                    'Empire State Building access',
                    'Metropolitan Museum pass',
                    'Subway unlimited pass',
                    'Food tour of Manhattan'
                ]),
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Sydney Coastal Explorer',
                'description' => '8 days discovering Sydney\'s beaches, harbor, and Blue Mountains.',
                'price' => 2199.99,
                'duration_days' => 8,
                'destination_id' => $destinations->where('name', 'Sydney, Australia')->first()->id,
                'available_dates' => json_encode(['2024-01-15', '2024-03-10', '2024-06-05', '2024-09-20']),
                'inclusions' => json_encode([
                    'Harbour view hotel',
                    'Sydney Opera House tour',
                    'Bondi Beach surfing lesson',
                    'Blue Mountains day trip',
                    'Harbour bridge climb',
                    'Taronga Zoo tickets',
                    'Ferry passes'
                ]),
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }

        // Create additional packages for other destinations
        $this->createAdditionalPackages($destinations);
    }

    private function createAdditionalPackages($destinations)
    {
        $additionalPackages = [
            [
                'title' => 'Cape Town Safari Adventure',
                'description' => '9 days combining city exploration with safari experience.',
                'price' => 2499.99,
                'duration_days' => 9,
                'destination_id' => $destinations->where('name', 'Cape Town, South Africa')->first()->id,
                'available_dates' => json_encode(['2024-02-10', '2024-05-15', '2024-08-20', '2024-11-05']),
                'inclusions' => json_encode(['Safari lodge accommodation', 'Game drives', 'Table Mountain cable car', 'Winelands tour']),
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'title' => 'Dubai Luxury Experience',
                'description' => '5 days of ultimate luxury in Dubai.',
                'price' => 3299.99,
                'duration_days' => 5,
                'destination_id' => $destinations->where('name', 'Dubai, UAE')->first()->id,
                'available_dates' => json_encode(['2024-03-05', '2024-04-20', '2024-10-15', '2024-12-01']),
                'inclusions' => json_encode(['Burj Al Arab stay', 'Desert safari', 'Burj Khalifa access', 'Shopping tour']),
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'title' => 'Rome Historical Journey',
                'description' => '7 days exploring ancient Rome and Vatican City.',
                'price' => 1899.99,
                'duration_days' => 7,
                'destination_id' => $destinations->where('name', 'Rome, Italy')->first()->id,
                'available_dates' => json_encode(['2024-04-10', '2024-06-05', '2024-09-15', '2024-10-30']),
                'inclusions' => json_encode(['Centrally located hotel', 'Colosseum tour', 'Vatican Museum access', 'Food tour']),
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($additionalPackages as $package) {
            Package::create($package);
        }
    }
}