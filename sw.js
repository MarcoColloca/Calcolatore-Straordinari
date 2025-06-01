// sw.js

// Quando il service worker viene installato
self.addEventListener('install', () => {
  console.log('✅ Service Worker installato');
  self.skipWaiting(); // attiva subito
});

// Quando viene attivato
self.addEventListener('activate', () => {
  console.log('✅ Service Worker attivato');
  return self.clients.claim(); // prende il controllo delle pagine aperte
});

// Questo fetch NON fa nulla, così non blocca richieste (comportamento sicuro)
self.addEventListener('fetch', (event) => {
  // Lasciamo che il browser gestisca tutto
});
