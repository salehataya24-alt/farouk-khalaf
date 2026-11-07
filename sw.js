/* =====================================================================
   sw.js — Service Worker (كاش ذكي)
   • الصفحة (HTML): من الشبكة أولاً، وإذا بطيئة أو مقطوعة بتطلع من الكاش
   • CSS / JS / أيقونات / لوغو: بتطلع فوراً من الكاش وبتتحدّث بالخلفية (stale-while-revalidate)
   • صور السيارات: كاش أول (بعد أول زيارة بتفتح فوراً) مع حد أقصى لعددها
   • الخطوط: كاش أول
   • الفيديو: ما بنكاشه أبداً (ملفات كبيرة وطلبات Range) — المتصفح بيتكفّل فيه
   غيّر رقم VERSION عند كل تحديث كبير.
   ===================================================================== */
const VERSION = "fk-v27";
const STATIC = VERSION + "-static";
const IMAGES = VERSION + "-images";
const FONTS = VERSION + "-fonts";
const MAX_IMAGES = 80;

const CORE = [
  "./",
  "index.html",
  "css/site.min.css?v=27",
  "js/site.min.js?v=27",
  "img/logos/logo-primary.webp",
  "img/hero-poster.webp",
];

self.addEventListener("install", (e) => {
  // كل ملف لحاله: إذا ملف مش موجود ما بيفشل التثبيت كله
  e.waitUntil(
    caches.open(STATIC).then((c) => Promise.allSettled(CORE.map((u) => c.add(u))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keep = [STATIC, IMAGES, FONTS];
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.enable(); } catch (_) {} }
    await self.clients.claim();
  })());
});

async function trim(cacheName, max) {
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => c.delete(k)));
}

const isVideo = (req, url) => req.headers.has("range") || /\.(mp4|webm|mov|m4v)$/i.test(url.pathname) || req.destination === "video";

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (isVideo(req, url)) return;                                   // الفيديو: بدون كاش

  /* ---------- الخطوط ---------- */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith((async () => {
      const c = await caches.open(FONTS);
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone());
      return res;
    })());
    return;
  }

  if (url.origin !== location.origin) return;

  /* ---------- الصفحة: الشبكة أولاً (مع مهلة 3 ثواني) ---------- */
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const c = await caches.open(STATIC);
      try {
        const pre = await e.preloadResponse;
        const net = pre || await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
        ]);
        if (net && net.ok) c.put("index.html", net.clone());
        return net;
      } catch (_) {
        return (await c.match("index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  /* ---------- صور السيارات: كاش أول ---------- */
  if (/\/img\/cars\//.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(IMAGES);
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok && res.status === 200) { c.put(req, res.clone()); trim(IMAGES, MAX_IMAGES); }
      return res;
    })());
    return;
  }

  /* ---------- باقي الملفات المحلية: stale-while-revalidate ---------- */
  e.respondWith((async () => {
    const c = await caches.open(STATIC);
    const hit = await c.match(req);
    const refresh = fetch(req).then((res) => { if (res && res.ok && res.status === 200) c.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(refresh); return hit; }
    return (await refresh) || Response.error();
  })());
});
