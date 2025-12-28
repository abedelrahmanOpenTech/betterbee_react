<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public $timestamps = false;

    public static function getSettings()
    {
        static $settings = null;

        if ($settings === null) {
            $settings = Settings::get()->first();
            if (!empty($settings)) {
                $settings->json = json_decode($settings->json);
            }
        }

        return $settings;
    }

    public static function has($key)
    {
        $settings = self::getSettings();
        if (empty($settings)) {
            return false;
        }

        return $settings->json->{$key};
    }
}
