/* global self, caches, fetch, URL, Response */

const CACHE_NAME = "skorpadelku-shell-v5";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/skorpadelku-icon-192.png",
  "/icons/skorpadelku-icon-512.png",
  "/brand/skorpadelku-logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleAsset(request));
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    await cache.put("/index.html", response.clone());
    return response;
  } catch {
    const cachedIndex = await caches.match("/index.html");
    const cachedRoot = await caches.match("/");

    return cachedIndex ?? cachedRoot ?? createOfflineFallback();
  }
}

async function handleAsset(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return createOfflineFallback();
  }
}

function createOfflineFallback() {
  return new Response("SkorPadelKu belum siap dibuka offline. Buka sekali saat online, lalu coba lagi.", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
