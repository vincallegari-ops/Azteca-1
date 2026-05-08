const CACHE = "monjeu-v2";
const FILES = [
  "/Azteca-1/",
  "/Azteca-1/index.html",
  "/Azteca-1/manifest.json",
  "/Azteca-1/dist/assets/index-Dd7kAKA0.js",
  "/Azteca-1/icon-192.png",
  "/Azteca-1/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
