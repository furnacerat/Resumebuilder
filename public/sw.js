const CACHE_NAME = "resume-generator-v1";
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/icons/icon.svg", "/icons/maskable-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? Promise.resolve() : caches.delete(k))));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET.
  if (req.method !== "GET") return;

  // Navigation: network-first with cached fallback to app shell.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match("/");
          if (cached) return cached;
          throw new Error("Offline and no app shell cached");
        }
      })(),
    );
    return;
  }

  // Assets: cache-first.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, fresh.clone());
      return fresh;
    })(),
  );
});
