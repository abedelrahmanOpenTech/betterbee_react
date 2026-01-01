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
    public static function buildUidSql($userId1, $userId2)
    {
        // SQL logic to match PHP's buildUid: always smaller_larger
        return "CONCAT(LEAST($userId1, $userId2), '_', GREATEST($userId1, $userId2))";
    }
}
