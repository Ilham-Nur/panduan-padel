/* global self, caches, fetch, URL, Response */

const CACHE_NAME = "skorpadelku-shell-v6";
const APP_SCOPE = new URL(self.registration.scope);
const appUrl = (path) => new URL(path, APP_SCOPE).toString();
const APP_SHELL = [
  appUrl("./"),
  appUrl("index.html"),
  appUrl("manifest.webmanifest"),
  appUrl("icons/skorpadelku-icon-192.png"),
  appUrl("icons/skorpadelku-icon-512.png"),
  appUrl("brand/skorpadelku-logo.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await cache.addAll(APP_SHELL);
        await cacheBuildAssets(cache);
      })
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

  if (!requestUrl.pathname.startsWith(APP_SCOPE.pathname)) {
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
    await cache.put(appUrl("index.html"), response.clone());
    return response;
  } catch {
    const cachedIndex = await caches.match(appUrl("index.html"));
    const cachedRoot = await caches.match(appUrl("./"));

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

async function cacheBuildAssets(cache) {
  try {
    const response = await fetch(appUrl("index.html"));
    const html = await response.text();
    const assetPaths = Array.from(html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g), (match) => match[1]);
    const assetUrls = assetPaths.map((path) => new URL(path, APP_SCOPE).toString());

    if (assetUrls.length > 0) {
      await cache.addAll(assetUrls);
    }
  } catch {
    // Core shell caching still allows the app to recover on the next online load.
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
