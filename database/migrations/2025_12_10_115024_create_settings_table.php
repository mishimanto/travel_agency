<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index(); // general, site, email, payment, social, seo
            $table->string('key')->index();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, boolean, integer, float, array, json
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false); // Can be accessed publicly
            $table->timestamps();
            
            $table->unique(['group', 'key']);
        });
        
        // Insert default settings
        $this->seedDefaultSettings();
    }
    
    private function seedDefaultSettings()
    {
        $defaultSettings = [
            // General Settings
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Travel Agency', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_email', 'value' => 'admin@gmail.com', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_phone', 'value' => '01949854504', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_address', 'value' => '123 Travel Street, City, Country', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'timezone', 'value' => 'UTC', 'type' => 'string', 'is_public' => false],
            ['group' => 'general', 'key' => 'date_format', 'value' => 'Y-m-d', 'type' => 'string', 'is_public' => false],
            ['group' => 'general', 'key' => 'time_format', 'value' => 'H:i:s', 'type' => 'string', 'is_public' => false],
            ['group' => 'general', 'key' => 'currency', 'value' => 'USD', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'currency_symbol', 'value' => '$', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'language', 'value' => 'en', 'type' => 'string', 'is_public' => true],
            
            // Site Settings
            ['group' => 'site', 'key' => 'logo', 'value' => '/images/logo.png', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'favicon', 'value' => '/images/favicon.ico', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'hero_title', 'value' => 'Discover Amazing Travel Destinations', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'hero_subtitle', 'value' => 'Book your dream vacation with us', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'about_text', 'value' => 'We are a leading travel agency providing the best travel experiences.', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'contact_email', 'value' => 'contact@travelagency.com', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'contact_phone', 'value' => '+1 234 567 8900', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'working_hours', 'value' => 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM', 'type' => 'string', 'is_public' => true],
            ['group' => 'site', 'key' => 'enable_registration', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'site', 'key' => 'enable_booking', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'site', 'key' => 'maintenance_mode', 'value' => '0', 'type' => 'boolean', 'is_public' => true],
            
            // Email Settings
            ['group' => 'email', 'key' => 'mail_driver', 'value' => 'smtp', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_host', 'value' => 'smtp.mailtrap.io', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_port', 'value' => '2525', 'type' => 'integer', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_username', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_password', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_encryption', 'value' => 'tls', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_from_address', 'value' => 'noreply@travelagency.com', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'mail_from_name', 'value' => 'Travel Agency', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'booking_confirmation_subject', 'value' => 'Booking Confirmation', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'booking_confirmation_template', 'value' => 'Your booking has been confirmed.', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'welcome_email_subject', 'value' => 'Welcome to Travel Agency', 'type' => 'string', 'is_public' => false],
            ['group' => 'email', 'key' => 'welcome_email_template', 'value' => 'Thank you for registering with us.', 'type' => 'string', 'is_public' => false],
            
            // Payment Settings
            ['group' => 'payment', 'key' => 'default_payment_method', 'value' => 'stripe', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'currency', 'value' => 'USD', 'type' => 'string', 'is_public' => true],
            ['group' => 'payment', 'key' => 'tax_rate', 'value' => '0.0', 'type' => 'float', 'is_public' => true],
            ['group' => 'payment', 'key' => 'enable_stripe', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'payment', 'key' => 'stripe_public_key', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'stripe_secret_key', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'enable_paypal', 'value' => '0', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'payment', 'key' => 'paypal_client_id', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'paypal_secret', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'paypal_mode', 'value' => 'sandbox', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'enable_bank_transfer', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'payment', 'key' => 'bank_account_name', 'value' => 'Travel Agency', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'bank_account_number', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'bank_name', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'payment', 'key' => 'bank_branch', 'value' => '', 'type' => 'string', 'is_public' => false],
            
            // Social Settings
            ['group' => 'social', 'key' => 'facebook_url', 'value' => 'https://facebook.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'twitter_url', 'value' => 'https://twitter.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'instagram_url', 'value' => 'https://instagram.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'youtube_url', 'value' => 'https://youtube.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'pinterest_url', 'value' => 'https://pinterest.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'tripadvisor_url', 'value' => 'https://tripadvisor.com/travelagency', 'type' => 'string', 'is_public' => true],
            ['group' => 'social', 'key' => 'enable_sharing', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            
            // SEO Settings
            ['group' => 'seo', 'key' => 'meta_title', 'value' => 'Travel Agency - Best Travel Packages', 'type' => 'string', 'is_public' => true],
            ['group' => 'seo', 'key' => 'meta_description', 'value' => 'Book amazing travel packages at affordable prices.', 'type' => 'string', 'is_public' => true],
            ['group' => 'seo', 'key' => 'meta_keywords', 'value' => 'travel, packages, vacation, tourism', 'type' => 'string', 'is_public' => true],
            ['group' => 'seo', 'key' => 'og_image', 'value' => '/images/og-image.jpg', 'type' => 'string', 'is_public' => true],
            ['group' => 'seo', 'key' => 'robots_txt', 'value' => 'User-agent: *\nDisallow: /admin/\nDisallow: /api/', 'type' => 'string', 'is_public' => true],
            ['group' => 'seo', 'key' => 'google_analytics_id', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'seo', 'key' => 'google_site_verification', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'seo', 'key' => 'bing_webmaster_tools', 'value' => '', 'type' => 'string', 'is_public' => false],
            ['group' => 'seo', 'key' => 'enable_sitemap', 'value' => '1', 'type' => 'boolean', 'is_public' => false],
            ['group' => 'seo', 'key' => 'sitemap_frequency', 'value' => 'weekly', 'type' => 'string', 'is_public' => false],
        ];
        
        foreach ($defaultSettings as $setting) {
            DB::table('settings')->insert($setting);
        }
    }
    
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};