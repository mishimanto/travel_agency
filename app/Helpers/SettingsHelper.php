<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsHelper
{
    public static function get($key, $default = null)
    {
        if (str_contains($key, '.')) {
            [$group, $key] = explode('.', $key, 2);
        } else {
            $group = 'general';
        }
        
        return Cache::rememberForever("settings.{$group}.{$key}", function () use ($group, $key, $default) {
            $setting = Setting::where('group', $group)
                ->where('key', $key)
                ->first();
                
            if (!$setting) {
                return $default;
            }
            
            return $setting->getCastedValue();
        });
    }
    
    public static function set($key, $value)
    {
        if (str_contains($key, '.')) {
            [$group, $key] = explode('.', $key, 2);
        } else {
            $group = 'general';
        }
        
        $setting = Setting::firstOrNew([
            'group' => $group,
            'key' => $key,
        ]);
        
        $setting->value = $value;
        
        // Determine type based on value
        if (is_bool($value)) {
            $setting->type = 'boolean';
        } elseif (is_int($value)) {
            $setting->type = 'integer';
        } elseif (is_float($value)) {
            $setting->type = 'float';
        } elseif (is_array($value) || is_object($value)) {
            $setting->type = 'array';
        } else {
            $setting->type = 'string';
        }
        
        $setting->save();
        
        // Clear cache
        Cache::forget("settings.{$group}.{$key}");
        Cache::forget("settings.group.{$group}");
        Cache::forget('settings.all');
        
        return $setting;
    }
    
    public static function all()
    {
        return Cache::rememberForever('settings.all', function () {
            return Setting::all()
                ->groupBy('group')
                ->map(function ($settings) {
                    return $settings->mapWithKeys(function ($setting) {
                        return [$setting->key => $setting->getCastedValue()];
                    });
                })
                ->toArray();
        });
    }
    
    public static function group($group)
    {
        return Cache::rememberForever("settings.group.{$group}", function () use ($group) {
            $settings = Setting::where('group', $group)->get();
            
            return $settings->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->getCastedValue()];
            })->toArray();
        });
    }
    
    public static function clearCache()
    {
        Cache::forget('settings.all');
        
        $groups = Setting::distinct()->pluck('group');
        foreach ($groups as $group) {
            Cache::forget("settings.group.{$group}");
        }
    }
    
    // Shortcut methods for common settings
    public static function siteName()
    {
        return self::get('general.site_name', config('app.name', 'Travel Agency'));
    }
    
    public static function siteEmail()
    {
        return self::get('general.site_email', config('mail.from.address', 'admin@example.com'));
    }
    
    public static function currency()
    {
        return self::get('general.currency', 'USD');
    }
    
    public static function currencySymbol()
    {
        return self::get('general.currency_symbol', '$');
    }
    
    public static function isMaintenanceMode()
    {
        return self::get('site.maintenance_mode', false);
    }
}