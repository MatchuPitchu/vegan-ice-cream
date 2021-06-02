// ONLY FOR INFORMATION AND NOT IN USE

// // Caching -> create const with name for cache
// const cacheName = 'eis-mit-stil-cache';
// // Resources we want to cache -> array of things
// const resourcesToPreCache = [
//   '/',
//   '/index.html',
//   '../src/App.tsx',
//   '/assets/icon/favicon.png',
//   '/assets/icon/icon.png',
//   '/manifest.json',
//   'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js',
// ];

// // self obj is the serviceworker itself -> we want here that serviceworker does
// // special thinks at some points (install, activate, fetch)
// // Install event
// self.addEventListener('install', async event => {
//   try {
//     const cache = await caches.open(cacheName);
//     cache.addAll(resourcesToPreCache);
//     console.log('Success, resources were cached!');
//   } catch (error) {
//     console.log('Error while caching: ', error);
//   }
// });
// // Activation event
// self.addEventListener('activate', event => {
//   console.log('Activate event!');
// });
// // Fetch event
// self.addEventListener('fetch', async event => {
//   const cachedResponse = await event.respondWith(caches.match(event.request));
//   return fetch(event.request) || cachedResponse;
// });