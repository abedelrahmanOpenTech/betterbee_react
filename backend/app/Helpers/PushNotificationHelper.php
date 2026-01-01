<?php

namespace App\Helpers;

use App\Models\UserNotificationSubscription;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushNotificationHelper
{
    public static function sendNotification($userId, $messagePayload)
    {
        $auth = [
            'GCM' => 'MY_GCM_API_KEY', // Not used for VAPID
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $webPush = new WebPush($auth);

        $subscriptions = UserNotificationSubscription::where('user_id', $userId)->get();

        foreach ($subscriptions as $sub) {
            $subscriptionData = json_decode($sub->subscription, true);

            if ($subscriptionData) {
                // Ensure required keys exist
                if (!isset($subscriptionData['endpoint'])) continue;

                $subscription = Subscription::create($subscriptionData);

                $webPush->queueNotification(
                    $subscription,
                    json_encode($messagePayload)
                );
            }
        }


        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                // echo "[v] Message sent successfully for subscription {$endpoint}.";
            } else {
                // echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
                // Optionally delete expired subscriptions
                if ($report->isSubscriptionExpired()) {
                    UserNotificationSubscription::where('subscription', 'like', '%' . $endpoint . '%')->delete();
                }
            }
        }
    }
}
