
const CONFIG = {
    title: 'Whisper',
    icon: "images/icon-192x192.png",
    badge: "images/icon-192x192.png",
    url: "/new_better_bee/new/frontend/",
    broadcastChannel: 'chat_updates_channel',
    broadcastEvent: 'PUSH_NOTIFICATION_RECEIVED'
};

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (event.data) {
        const payload = event.data.json();
        const message = payload.message || 'New message';

        if (navigator.setAppBadge) {
            navigator.setAppBadge().catch((error) => {
                // Silently fail if badge setting fails
            });
        }

        const channel = new BroadcastChannel(CONFIG.broadcastChannel);
        channel.postMessage({ type: CONFIG.broadcastEvent });
        channel.close(); // Close channel after sending

        event.waitUntil(
            self.registration.showNotification(CONFIG.title, {
                body: message,
                icon: CONFIG.icon,
                // badge: CONFIG.badge, // Uncomment if you have a badge icon
                data: {
                    url: CONFIG.url
                }
            })
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (navigator.clearAppBadge) {
        navigator.clearAppBadge().catch((error) => {
            // Silently fail
        });
    }

    event.waitUntil(
        clients.matchAll({
            type: "window"
        }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == CONFIG.url && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow(CONFIG.url);
            }
        })
    );
});

// async function updateLastSeen() {
//     console.log('66');
//     await http(`${apiUrl}/update-last-seen`);
//     setTimeout(() => {
//         updateLastSeen();
//     }, 1000);

// }

// updateLastSeen();
