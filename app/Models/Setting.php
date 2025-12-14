<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
    ];
    
    protected $casts = [
        'is_public' => 'boolean',
    ];
    
    public function getCastedValueAttribute()
    {
        return $this->getCastedValue();
    }
    
    public function getCastedValue()
    {
        $value = $this->value;
        
        if ($this->type === 'boolean') {
            return (bool) $value;
        } elseif ($this->type === 'integer') {
            return (int) $value;
        } elseif ($this->type === 'float') {
            return (float) $value;
        } elseif ($this->type === 'array' || $this->type === 'json') {
            try {
                return json_decode($value, true) ?: [];
            } catch (\Exception $e) {
                return [];
            }
        }
        
        return $value;
    }
    
    public function setValueAttribute($value)
    {
        if (is_array($value) || is_object($value)) {
            $this->attributes['value'] = json_encode($value);
            $this->type = 'array';
        } elseif (is_bool($value)) {
            $this->attributes['value'] = $value ? '1' : '0';
            $this->type = 'boolean';
        } elseif (is_int($value)) {
            $this->attributes['value'] = (string) $value;
            $this->type = 'integer';
        } elseif (is_float($value)) {
            $this->attributes['value'] = (string) $value;
            $this->type = 'float';
        } else {
            $this->attributes['value'] = (string) $value;
            $this->type = 'string';
        }
    }
    
    // Static helper methods
    public static function getValue($group, $key, $default = null)
    {
        $setting = self::where('group', $group)
            ->where('key', $key)
            ->first();
            
        return $setting ? $setting->getCastedValue() : $default;
    }
    
    public static function setValue($group, $key, $value)
    {
        $setting = self::firstOrNew([
            'group' => $group,
            'key' => $key,
        ]);
        
        $setting->value = $value;
        $setting->save();
        
        return $setting;
    }
    
    public static function getGroup($group)
    {
        return self::where('group', $group)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->getCastedValue()];
            })
            ->toArray();
    }
    
    public static function updateGroup($group, array $data)
    {
        foreach ($data as $key => $value) {
            self::setValue($group, $key, $value);
        }
        
        return true;
    }
}