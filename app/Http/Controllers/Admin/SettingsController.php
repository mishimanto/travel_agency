<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        // Database থেকে settings নিয়ে আসা
        $settings = [
            'general' => $this->getGeneralSettings(),
            'site' => $this->getSiteSettings(),
            'email' => $this->getEmailSettings(),
            'payment' => $this->getPaymentSettings(),
            'social' => $this->getSocialSettings(),
            'seo' => $this->getSeoSettings(),
        ];
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }
    
    public function update(Request $request)
    {
        $section = $request->input('section', 'general');
        
        switch ($section) {
            case 'general':
                return $this->updateGeneralSettings($request);
                
            case 'site':
                return $this->updateSiteSettings($request);
                
            case 'email':
                return $this->updateEmailSettings($request);
                
            case 'payment':
                return $this->updatePaymentSettings($request);
                
            case 'social':
                return $this->updateSocialSettings($request);
                
            case 'seo':
                return $this->updateSeoSettings($request);
                
            default:
                return back()->with('error', 'Invalid settings section.');
        }
    }
    
    // Database থেকে settings পড়ার methods
    private function getGeneralSettings()
    {
        return [
            'site_name' => Setting::getValue('general', 'site_name', config('app.name', 'Travel Agency')),
            'site_email' => Setting::getValue('general', 'site_email', 'admin@travelagency.com'),
            'site_phone' => Setting::getValue('general', 'site_phone', '+1 234 567 8900'),
            'site_address' => Setting::getValue('general', 'site_address', '123 Travel Street, City, Country'),
            'timezone' => Setting::getValue('general', 'timezone', 'UTC'),
            'date_format' => Setting::getValue('general', 'date_format', 'Y-m-d'),
            'time_format' => Setting::getValue('general', 'time_format', 'H:i:s'),
            'currency' => Setting::getValue('general', 'currency', 'USD'),
            'currency_symbol' => Setting::getValue('general', 'currency_symbol', '$'),
            'language' => Setting::getValue('general', 'language', 'en'),
        ];
    }
    
    private function getSiteSettings()
    {
        return [
            'logo' => Setting::getValue('site', 'logo', '/images/logo.png'),
            'favicon' => Setting::getValue('site', 'favicon', '/images/favicon.ico'),
            'hero_title' => Setting::getValue('site', 'hero_title', 'Discover Amazing Travel Destinations'),
            'hero_subtitle' => Setting::getValue('site', 'hero_subtitle', 'Book your dream vacation with us'),
            'about_text' => Setting::getValue('site', 'about_text', 'We are a leading travel agency providing the best travel experiences.'),
            'contact_email' => Setting::getValue('site', 'contact_email', 'contact@travelagency.com'),
            'contact_phone' => Setting::getValue('site', 'contact_phone', '+1 234 567 8900'),
            'working_hours' => Setting::getValue('site', 'working_hours', 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'),
            'enable_registration' => (bool) Setting::getValue('site', 'enable_registration', true),
            'enable_booking' => (bool) Setting::getValue('site', 'enable_booking', true),
            'maintenance_mode' => (bool) Setting::getValue('site', 'maintenance_mode', false),
        ];
    }
    
    private function getEmailSettings()
    {
        return [
            'mail_driver' => Setting::getValue('email', 'mail_driver', 'smtp'),
            'mail_host' => Setting::getValue('email', 'mail_host', 'smtp.mailtrap.io'),
            'mail_port' => (int) Setting::getValue('email', 'mail_port', 2525),
            'mail_username' => Setting::getValue('email', 'mail_username', ''),
            'mail_password' => Setting::getValue('email', 'mail_password', ''),
            'mail_encryption' => Setting::getValue('email', 'mail_encryption', 'tls'),
            'mail_from_address' => Setting::getValue('email', 'mail_from_address', 'noreply@travelagency.com'),
            'mail_from_name' => Setting::getValue('email', 'mail_from_name', 'Travel Agency'),
            'booking_confirmation_subject' => Setting::getValue('email', 'booking_confirmation_subject', 'Booking Confirmation'),
            'booking_confirmation_template' => Setting::getValue('email', 'booking_confirmation_template', 'Your booking has been confirmed.'),
            'welcome_email_subject' => Setting::getValue('email', 'welcome_email_subject', 'Welcome to Travel Agency'),
            'welcome_email_template' => Setting::getValue('email', 'welcome_email_template', 'Thank you for registering with us.'),
        ];
    }
    
    private function getPaymentSettings()
    {
        return [
            'default_payment_method' => Setting::getValue('payment', 'default_payment_method', 'stripe'),
            'currency' => Setting::getValue('payment', 'currency', 'USD'),
            'tax_rate' => (float) Setting::getValue('payment', 'tax_rate', 0.0),
            'enable_stripe' => (bool) Setting::getValue('payment', 'enable_stripe', true),
            'stripe_public_key' => Setting::getValue('payment', 'stripe_public_key', ''),
            'stripe_secret_key' => Setting::getValue('payment', 'stripe_secret_key', ''),
            'enable_paypal' => (bool) Setting::getValue('payment', 'enable_paypal', false),
            'paypal_client_id' => Setting::getValue('payment', 'paypal_client_id', ''),
            'paypal_secret' => Setting::getValue('payment', 'paypal_secret', ''),
            'paypal_mode' => Setting::getValue('payment', 'paypal_mode', 'sandbox'),
            'enable_bank_transfer' => (bool) Setting::getValue('payment', 'enable_bank_transfer', true),
            'bank_account_name' => Setting::getValue('payment', 'bank_account_name', 'Travel Agency'),
            'bank_account_number' => Setting::getValue('payment', 'bank_account_number', ''),
            'bank_name' => Setting::getValue('payment', 'bank_name', ''),
            'bank_branch' => Setting::getValue('payment', 'bank_branch', ''),
        ];
    }
    
    private function getSocialSettings()
    {
        return [
            'facebook_url' => Setting::getValue('social', 'facebook_url', 'https://facebook.com/travelagency'),
            'twitter_url' => Setting::getValue('social', 'twitter_url', 'https://twitter.com/travelagency'),
            'instagram_url' => Setting::getValue('social', 'instagram_url', 'https://instagram.com/travelagency'),
            'linkedin_url' => Setting::getValue('social', 'linkedin_url', 'https://linkedin.com/company/travelagency'),
            'youtube_url' => Setting::getValue('social', 'youtube_url', 'https://youtube.com/travelagency'),
            'pinterest_url' => Setting::getValue('social', 'pinterest_url', 'https://pinterest.com/travelagency'),
            'tripadvisor_url' => Setting::getValue('social', 'tripadvisor_url', 'https://tripadvisor.com/travelagency'),
            'enable_sharing' => (bool) Setting::getValue('social', 'enable_sharing', true),
        ];
    }
    
    private function getSeoSettings()
    {
        return [
            'meta_title' => Setting::getValue('seo', 'meta_title', 'Travel Agency - Best Travel Packages'),
            'meta_description' => Setting::getValue('seo', 'meta_description', 'Book amazing travel packages at affordable prices.'),
            'meta_keywords' => Setting::getValue('seo', 'meta_keywords', 'travel, packages, vacation, tourism'),
            'og_image' => Setting::getValue('seo', 'og_image', '/images/og-image.jpg'),
            'robots_txt' => Setting::getValue('seo', 'robots_txt', "User-agent: *\nDisallow: /admin/\nDisallow: /api/"),
            'google_analytics_id' => Setting::getValue('seo', 'google_analytics_id', ''),
            'google_site_verification' => Setting::getValue('seo', 'google_site_verification', ''),
            'bing_webmaster_tools' => Setting::getValue('seo', 'bing_webmaster_tools', ''),
            'enable_sitemap' => (bool) Setting::getValue('seo', 'enable_sitemap', true),
            'sitemap_frequency' => Setting::getValue('seo', 'sitemap_frequency', 'weekly'),
        ];
    }
    
    // Update methods
    private function updateGeneralSettings(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_email' => 'required|email|max:255',
            'site_phone' => 'nullable|string|max:50',
            'site_address' => 'nullable|string|max:500',
            'timezone' => 'required|string|timezone',
            'date_format' => 'required|string|max:20',
            'time_format' => 'required|string|max:20',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:5',
            'language' => 'required|string|max:10',
        ]);
        
        foreach ($validated as $key => $value) {
            Setting::setValue('general', $key, $value);
        }
        
        // Update config values
        config(['app.name' => $validated['site_name']]);
        config(['app.timezone' => $validated['timezone']]);
        config(['app.locale' => $validated['language']]);
        
        return back()->with('success', 'General settings updated successfully.');
    }
    
    private function updateSiteSettings(Request $request)
    {
        $rules = [
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string|max:500',
            'about_text' => 'nullable|string',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'working_hours' => 'nullable|string|max:255',
            'enable_registration' => 'boolean',
            'enable_booking' => 'boolean',
            'maintenance_mode' => 'boolean',
            'remove_logo' => 'nullable|boolean',
            'remove_favicon' => 'nullable|boolean',
        ];

        // Only validate logo if it's being uploaded (not being removed)
        if ($request->hasFile('logo') && !$request->boolean('remove_logo')) {
            $rules['logo'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048';
        }

        // Only validate favicon if it's being uploaded (not being removed)
        if ($request->hasFile('favicon') && !$request->boolean('remove_favicon')) {
            $rules['favicon'] = 'nullable|image|mimes:ico,png|max:1024';
        }

        $validated = $request->validate($rules);

        // Handle file uploads and removals
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('settings', 'public');
            $validated['logo'] = Storage::url($logoPath);
        } elseif ($request->has('remove_logo') && $request->boolean('remove_logo')) {
            $validated['logo'] = '/images/logo.png'; // Default logo
        } else {
            // Keep existing logo if not changing
            unset($validated['logo']);
        }

        if ($request->hasFile('favicon')) {
            $faviconPath = $request->file('favicon')->store('settings', 'public');
            $validated['favicon'] = Storage::url($faviconPath);
        } elseif ($request->has('remove_favicon') && $request->boolean('remove_favicon')) {
            $validated['favicon'] = '/images/favicon.ico'; // Default favicon
        } else {
            // Keep existing favicon if not changing
            unset($validated['favicon']);
        }

        // Remove the helper fields from validated data before saving
        unset($validated['remove_logo'], $validated['remove_favicon']);

        // Set default values if not provided
        $validated['enable_registration'] = $validated['enable_registration'] ?? false;
        $validated['enable_booking'] = $validated['enable_booking'] ?? false;
        $validated['maintenance_mode'] = $validated['maintenance_mode'] ?? false;

        foreach ($validated as $key => $value) {
            Setting::setValue('site', $key, $value);
        }

        return back()->with('success', 'Site settings updated successfully.');
    }
    
    private function updateEmailSettings(Request $request)
    {
        $validated = $request->validate([
            'mail_driver' => 'required|string|in:smtp,sendmail,mailgun,ses,postmark,log,array',
            'mail_host' => 'required|string|max:255',
            'mail_port' => 'required|integer|min:1|max:65535',
            'mail_username' => 'nullable|string|max:255',
            'mail_password' => 'nullable|string|max:255',
            'mail_encryption' => 'nullable|string|in:tls,ssl,starttls',
            'mail_from_address' => 'required|email|max:255',
            'mail_from_name' => 'required|string|max:255',
            'booking_confirmation_subject' => 'required|string|max:255',
            'booking_confirmation_template' => 'nullable|string',
            'welcome_email_subject' => 'required|string|max:255',
            'welcome_email_template' => 'nullable|string',
        ]);
        
        foreach ($validated as $key => $value) {
            Setting::setValue('email', $key, $value);
        }
        
        return back()->with('success', 'Email settings updated successfully.');
    }
    
    private function updatePaymentSettings(Request $request)
    {
        $validated = $request->validate([
            'default_payment_method' => 'required|string|in:stripe,paypal,bank_transfer',
            'currency' => 'required|string|max:10',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'enable_stripe' => 'boolean',
            'stripe_public_key' => 'required_if:enable_stripe,1|string|max:255',
            'stripe_secret_key' => 'required_if:enable_stripe,1|string|max:255',
            'enable_paypal' => 'boolean',
            'paypal_client_id' => 'required_if:enable_paypal,1|string|max:255',
            'paypal_secret' => 'required_if:enable_paypal,1|string|max:255',
            'paypal_mode' => 'required_if:enable_paypal,1|string|in:sandbox,live',
            'enable_bank_transfer' => 'boolean',
            'bank_account_name' => 'required_if:enable_bank_transfer,1|string|max:255',
            'bank_account_number' => 'required_if:enable_bank_transfer,1|string|max:50',
            'bank_name' => 'required_if:enable_bank_transfer,1|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
        ]);
        
        // Set default values for boolean fields
        $validated['enable_stripe'] = $validated['enable_stripe'] ?? false;
        $validated['enable_paypal'] = $validated['enable_paypal'] ?? false;
        $validated['enable_bank_transfer'] = $validated['enable_bank_transfer'] ?? false;
        
        foreach ($validated as $key => $value) {
            Setting::setValue('payment', $key, $value);
        }
        
        return back()->with('success', 'Payment settings updated successfully.');
    }
    
    private function updateSocialSettings(Request $request)
    {
        $validated = $request->validate([
            'facebook_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
            'pinterest_url' => 'nullable|url|max:255',
            'tripadvisor_url' => 'nullable|url|max:255',
            'enable_sharing' => 'boolean',
        ]);
        
        $validated['enable_sharing'] = $validated['enable_sharing'] ?? false;
        
        foreach ($validated as $key => $value) {
            Setting::setValue('social', $key, $value);
        }
        
        return back()->with('success', 'Social settings updated successfully.');
    }
    
    private function updateSeoSettings(Request $request)
    {
        $rules = [
            'meta_title' => 'required|string|max:255',
            'meta_description' => 'required|string|max:500',
            'meta_keywords' => 'required|string|max:500',
            'robots_txt' => 'nullable|string',
            'google_analytics_id' => 'nullable|string|max:50',
            'google_site_verification' => 'nullable|string|max:255',
            'bing_webmaster_tools' => 'nullable|string|max:255',
            'enable_sitemap' => 'boolean',
            'sitemap_frequency' => 'required|string|in:daily,weekly,monthly,yearly',
            'remove_og_image' => 'nullable|boolean',
        ];

        // Only validate og_image if it's being uploaded (not being removed)
        if ($request->hasFile('og_image') && !$request->boolean('remove_og_image')) {
            $rules['og_image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
        }

        $validated = $request->validate($rules);

        // Handle OG image upload and removal
        if ($request->hasFile('og_image')) {
            $ogImagePath = $request->file('og_image')->store('settings', 'public');
            $validated['og_image'] = Storage::url($ogImagePath);
        } elseif ($request->has('remove_og_image') && $request->boolean('remove_og_image')) {
            $validated['og_image'] = '/images/og-image.jpg'; // Default OG image
        } else {
            // Keep existing OG image if not changing
            unset($validated['og_image']);
        }

        // Remove helper field
        unset($validated['remove_og_image']);

        $validated['enable_sitemap'] = $validated['enable_sitemap'] ?? false;

        foreach ($validated as $key => $value) {
            Setting::setValue('seo', $key, $value);
        }

        return back()->with('success', 'SEO settings updated successfully.');
    }
    
    public function backup()
    {
        $settings = Setting::all()->map(function ($setting) {
            return [
                'group' => $setting->group,
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
            ];
        })->toArray();
        
        $filename = 'settings-backup-' . date('Y-m-d-H-i-s') . '.json';
        
        $headers = [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        return response()->json($settings, 200, $headers);
    }
    
    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:json|max:10240',
        ]);
        
        $content = file_get_contents($request->file('backup_file')->getPathname());
        $data = json_decode($content, true);
        
        if (!$data || !is_array($data)) {
            return back()->with('error', 'Invalid backup file format.');
        }
        
        // Clear existing settings
        Setting::truncate();
        
        // Restore settings from backup
        foreach ($data as $item) {
            Setting::create([
                'group' => $item['group'],
                'key' => $item['key'],
                'value' => $item['value'],
                'type' => $item['type'] ?? 'string',
            ]);
        }
        
        return back()->with('success', 'Settings restored successfully.');
    }
    
    public function reset(Request $request)
    {
        $request->validate([
            'section' => 'required|in:general,site,email,payment,social,seo',
        ]);
        
        $section = $request->section;
        $defaults = $this->getDefaultSettings($section);
        
        foreach ($defaults as $key => $value) {
            Setting::setValue($section, $key, $value);
        }
        
        return back()->with('success', ucfirst($section) . ' settings reset to defaults.');
    }
    
    private function getDefaultSettings($section)
    {
        $defaults = [
            'general' => [
                'site_name' => 'Travel Agency',
                'site_email' => 'admin@travelagency.com',
                'site_phone' => '+1 234 567 8900',
                'site_address' => '123 Travel Street, City, Country',
                'timezone' => 'UTC',
                'date_format' => 'Y-m-d',
                'time_format' => 'H:i:s',
                'currency' => 'USD',
                'currency_symbol' => '$',
                'language' => 'en',
            ],
            'site' => [
                'logo' => '/images/logo.png',
                'favicon' => '/images/favicon.ico',
                'hero_title' => 'Discover Amazing Travel Destinations',
                'hero_subtitle' => 'Book your dream vacation with us',
                'about_text' => 'We are a leading travel agency providing the best travel experiences.',
                'contact_email' => 'contact@travelagency.com',
                'contact_phone' => '+1 234 567 8900',
                'working_hours' => 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
                'enable_registration' => true,
                'enable_booking' => true,
                'maintenance_mode' => false,
            ],
            'email' => [
                'mail_driver' => 'smtp',
                'mail_host' => 'smtp.mailtrap.io',
                'mail_port' => 2525,
                'mail_username' => '',
                'mail_password' => '',
                'mail_encryption' => 'tls',
                'mail_from_address' => 'noreply@travelagency.com',
                'mail_from_name' => 'Travel Agency',
                'booking_confirmation_subject' => 'Booking Confirmation',
                'booking_confirmation_template' => 'Your booking has been confirmed.',
                'welcome_email_subject' => 'Welcome to Travel Agency',
                'welcome_email_template' => 'Thank you for registering with us.',
            ],
            'payment' => [
                'default_payment_method' => 'stripe',
                'currency' => 'USD',
                'tax_rate' => 0.0,
                'enable_stripe' => true,
                'stripe_public_key' => '',
                'stripe_secret_key' => '',
                'enable_paypal' => false,
                'paypal_client_id' => '',
                'paypal_secret' => '',
                'paypal_mode' => 'sandbox',
                'enable_bank_transfer' => true,
                'bank_account_name' => 'Travel Agency',
                'bank_account_number' => '',
                'bank_name' => '',
                'bank_branch' => '',
            ],
            'social' => [
                'facebook_url' => 'https://facebook.com/travelagency',
                'twitter_url' => 'https://twitter.com/travelagency',
                'instagram_url' => 'https://instagram.com/travelagency',
                'linkedin_url' => 'https://linkedin.com/company/travelagency',
                'youtube_url' => 'https://youtube.com/travelagency',
                'pinterest_url' => 'https://pinterest.com/travelagency',
                'tripadvisor_url' => 'https://tripadvisor.com/travelagency',
                'enable_sharing' => true,
            ],
            'seo' => [
                'meta_title' => 'Travel Agency - Best Travel Packages',
                'meta_description' => 'Book amazing travel packages at affordable prices.',
                'meta_keywords' => 'travel, packages, vacation, tourism',
                'og_image' => '/images/og-image.jpg',
                'robots_txt' => "User-agent: *\nDisallow: /admin/\nDisallow: /api/",
                'google_analytics_id' => '',
                'google_site_verification' => '',
                'bing_webmaster_tools' => '',
                'enable_sitemap' => true,
                'sitemap_frequency' => 'weekly',
            ],
        ];
        
        return $defaults[$section] ?? [];
    }
}