/* =====================================================================
   sheet.js — بيقرأ السيارات من جدول Google Sheets (مجاني) بدل ما تعدّل الكود
   • الرابط بيتحط بـ js/data.js → SITE.sheetUrl
   • إذا الرابط فاضي أو الإنترنت واقع، الموقع بيستعمل السيارات اللي بـ js/cars.js
   • أسماء الأعمدة بالجدول لازم تكون بالإنكليزي مثل ملف cars-template.csv
   ===================================================================== */
(function () {
  const NUM = ["year", "price", "mileage", "engineCC", "cylinders", "doors", "seats", "tank", "paintedParts", "photos"];
  const CACHE = "fk_sheet_cars_v2";

  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += ch;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }

  // رابط صورة من Google Drive (مشاركة) بيتحول لرابط بيظهر بالموقع
  const fixImage = (u) => {
    const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([\w-]+)/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1400` : u;
  };

  function toCars(rows) {
    const head = rows[0].map((h) => h.trim());
    const cars = [];
    rows.slice(1).forEach((r, n) => {
      const g = {}; head.forEach((h, i) => { const v = (r[i] || "").trim(); if (h && v !== "") g[h] = v; });
      if (/^(no|لا|0|hide|false)$/i.test(g.show || "")) return;          // عمود show: اكتب no لتخفي السيارة
      if (!g.brand && !g.model) return;
      const o = {};
      // كل الأعمدة بتنقل لحالها (desc_ar/desc_en/brand_ar/model_ar/photos كمان) والدالة car() بتدمج العربي والإنكليزي
      Object.keys(g).forEach((k) => { if (!["show", "images", "down", "monthly", "months", "negotiable"].includes(k)) o[k] = NUM.includes(k) ? Number(String(g[k]).replace(/[, ]/g, "")) : g[k]; });
      if (/^(yes|نعم|1|true|hide)$/i.test(g.hide || "")) return;
      if (g.negotiable) o.negotiable = !/^(no|لا|0|false)$/i.test(g.negotiable);
      if (g.down || g.monthly) o.installment = { down: Number(g.down) || 0, monthly: Number(g.monthly) || 0, months: Number(g.months) || 0 };
      o.images = (g.images || "").split(/[\n,;|]+|\s{2,}/).map((x) => x.trim()).filter(Boolean).map((x) => fixImage(x));
      if (!o.id) o.id = "FK-ROW-" + (n + 2);
      o.hide = false;
      cars.push(car(o));
    });
    return cars;
  }

  const apply = (cars) => { if (cars.length) CARS.splice(0, CARS.length, ...cars); };
  const sig = (cars) => JSON.stringify(cars);

  window.CARS_READY = (async () => {
    const url = SITE.sheetUrl;
    if (!url) return;
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE) || "null"); } catch (e) {}
    const fetchFresh = async () => {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 8000);
      try {
        const res = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { signal: ctl.signal });
        if (!res.ok) throw new Error(res.status);
        const cars = toCars(parseCSV(await res.text()));
        if (!cars.length) throw new Error("empty");
        return cars;
      } finally { clearTimeout(timer); }
    };
    if (cached && cached.length) {
      apply(cached);                                           // عرض فوري من آخر نسخة محفوظة
      fetchFresh().then((fresh) => {
        if (sig(fresh) !== sig(cached)) { apply(fresh); try { localStorage.setItem(CACHE, JSON.stringify(fresh)); } catch (e) {} if (FK.rerender) FK.rerender(); }
      }).catch(() => {});
      return;
    }
    try { const fresh = await fetchFresh(); apply(fresh); try { localStorage.setItem(CACHE, JSON.stringify(fresh)); } catch (e) {} return true; }
    catch (e) { console.warn("Sheet load failed, using js/cars.js", e); }
  })();
})();
