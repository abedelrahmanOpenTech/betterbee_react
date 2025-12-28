self.addEventListener('install', event => {
    self.skipWaiting(); // Forces the waiting service worker to become active immediately
    // Any caching logic here, typically inside event.waitUntil()
});

self.addEventListener('fetch', evt => {

});
