import { apiUrl } from "../config";
import { http } from "./http";

let swRegistration = null;

export function saveServiceWorkerRegistration(registration) {
    swRegistration = registration;
}

/**
 * Initializes push notification process by checking support,
 * requesting permission, and subscribing the user.
 */
export async function initializePushNotifications() {
    // 1. Check if Push API is supported by the browser
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported in this browser.');
        return;
    }

    try {
        // Register Service Worker if not already
        if (!swRegistration) {
            swRegistration = await navigator.serviceWorker.register('/sw.js');
        }

        // 2. Request notification permission from the user
        // It's best practice to tie this to a user gesture (e.g., a button click)
        // rather than doing it immediately on page load for a better UX.
        // For this example, we'll call it directly.
        requestNotificationPermission();

    } catch (error) {
        console.error('Service Worker Registration failed:', error);
    }
}

/**
 * Requests notification permission from the user.
 */
export function requestNotificationPermission() {
    Notification.requestPermission()
        .then(permission => {
            if (permission === 'granted') {
                // If permission is granted, proceed to subscribe the user
                subscribeUser();
            } else {
                console.warn('Notification permission denied. Cannot subscribe for push.');
            }
        })
        .catch(error => {
            console.error('Error requesting notification permission:', error);
        });
}

/**
 * Subscribes the user to push notifications and logs the subscription object (token).
 */
export function subscribeUser() {
    const applicationServerKey = 'BG1qIsC59QXhmz1g2tiwzugGVI_WZ24BovpxEyVuug9VSBBXdZz2mIFdv52yf5qLw-qiEgDVrLLesmbMGy5C5tQ';
    const applicationServerKeyUint8Array = urlB64ToUint8Array(applicationServerKey);

    if (!swRegistration) {
        console.error('Service Worker registration not found.');
        return;
    }

    swRegistration.pushManager.subscribe({
        userVisibleOnly: true, // Required: ensures notifications are always visible to the user
        applicationServerKey: applicationServerKeyUint8Array
    })
        .then(async subscription => {
            await http(apiUrl + "/save-notification-subscription", {
                method: 'post',
                body: JSON.stringify({
                    subscription: subscription
                })
            });
        })
        .catch(error => {
            // Handle subscription errors
            if (Notification.permission === 'denied') {
                console.warn('Push subscription failed: Notifications are blocked by the user.');
            } else {
                console.error('Push subscription failed:', error);
            }
        });
}

/**
 * Utility function to convert a Base64 URL-safe string to a Uint8Array.
 * This is necessary for the applicationServerKey.
 * @param {string} base64String The Base64 URL-safe string.
 * @returns {Uint8Array} The converted Uint8Array.
 */
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
