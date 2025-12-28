<?php

namespace App\Helpers;

class ChatHelper
{
    public static function buildUid($userID1, $userID2)
    {
        $firstId = $userID2;
        $secondId = $userID1;
        if ($userID1 < $userID2) {
            $firstId = $userID1;
            $secondId = $userID2;
        }

        return "{$firstId}_{$secondId}";
    }
}
