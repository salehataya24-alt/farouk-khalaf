/* =====================================================================
   app.js — الأساسيات: الترجمة، بطاقة السيارة، نافذة التفاصيل، واتساب
   (ما بتحتاج تعدل هون)
   ===================================================================== */
const FK = { lang: "ar", views: {}, after: {}, favs: new Set() };

(function () {
  try { FK.lang = localStorage.getItem("fk_lang") || "ar"; } catch (e) {}
  try { JSON.parse(localStorage.getItem("fk_favs") || "[]").forEach((id) => FK.favs.add(id)); } catch (e) {}

  const $ = (s, r = document) => r.querySelector(s);

  FK.t = (k, vars) => {
    let s = I18N[FK.lang] && I18N[FK.lang][k];
    if (s === undefined) s = I18N.en[k] !== undefined ? I18N.en[k] : k;
    if (vars && typeof s === "string") for (const v in vars) s = s.replace("{" + v + "}", vars[v]);
    return s;
  };
  FK.L = (o) => (o && typeof o === "object" ? o[FK.lang] || o.ar || o.en || "" : o == null ? "" : o);
  FK.num = (n) => Number(n).toLocaleString("en-US");
  /* ---------- العملة: دولار أو درهم (الأسعار بالبيانات بالدولار، والدرهم مربوط بـ 3.6725) ---------- */
  FK.rate = 3.6725; // سعر افتراضي (الدرهم مربوط بالدولار) يُستبدل بالسعر المباشر أول ما يوصل
  FK.rateLive = false;
  const RATE_SOURCES = [
    ["https://open.er-api.com/v6/latest/USD", (d) => d && d.rates && d.rates.AED],
    ["https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", (d) => d && d.usd && d.usd.aed],
  ];
  const setRate = (v, live) => {
    if (!(v > 3.5 && v < 3.8)) return false; // حماية من أرقام غلط
    FK.rate = v; FK.rateLive = live;
    document.dispatchEvent(new CustomEvent("fk:rate"));
    return true;
  };
  FK.refreshRate = async () => {
    try {
      const c = JSON.parse(localStorage.getItem("fk_rate") || "null");
      if (c && Date.now() - c.t < 6 * 3600 * 1000 && setRate(c.v, true)) return; // محفوظ أقل من 6 ساعات
    } catch (e) {}
    for (const [url, pick] of RATE_SOURCES) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        const v = Number(pick(await r.json()));
        if (setRate(v, true)) { try { localStorage.setItem("fk_rate", JSON.stringify({ v, t: Date.now() })); } catch (e) {} return; }
      } catch (e) {}
    }
  };
  FK.cur = "USD";
  try { if (localStorage.getItem("fk_cur") === "AED") FK.cur = "AED"; } catch (e) {}
  FK.setCur = (c) => { FK.cur = c === "AED" ? "AED" : "USD"; try { localStorage.setItem("fk_cur", FK.cur); } catch (e) {} };
  FK.money = (n) => FK.cur === "AED"
    ? "AED " + FK.num(Math.round(n * FK.rate))
    : SITE.currency + FK.num(n);
  FK.byId = (id) => CARS.find((c) => c.id === id);
  FK.carName = (c) => (FK.lang === "ar" && (c.brand_ar || c.model_ar) ? (c.brand_ar || c.brand) + " " + (c.model_ar || c.model) : c.brand + " " + c.model);
  FK.esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const t = FK.t, L = FK.L, num = FK.num, money = FK.money, esc = FK.esc;

  /* ---------- صورة السيارة: صورة حقيقية أو رسم تلقائي ----------
     سرعة التحميل: أول صور الصفحة eager + أولوية عالية، والباقي lazy، وكلها decoding=async.
     إذا الصورة ما انفتحت بيظهر رسم السيارة بدل فراغ.  ---------- */
  // روابط Google Drive بتتصغّر للبطاقات (أخف بكتير من الصورة الكاملة)
  const smallDrive = (u) => u.replace(/([?&]sz=)w\d+/, "$1w640");
  // النسخة الصغيرة (640px) للصور المحلية: img/cars/574-1.webp ← img/cars/sm/574-1.webp
  // (بتنعمل أوتوماتيك بـ tools/optimize-media.mjs). إذا مش موجودة بيرجع للصورة الأصلية لحاله.
  const isLocal = (u) => !/^(https?:)?\/\//.test(u) && !/^data:/.test(u);
  const smallLocal = (u) => u.replace(/([^/]+)$/, "sm/$1");
  FK.art = (c, i = 0, o = {}) => {
    const src = c.images && c.images[i];
    if (!src) return carSVG({ color: COLORS[c.color] || "#888", body: c.body, brand: c.brand });
    // أول صورتين بس بأولوية عالية (اللي بتظهر فوق)، الباقي lazy
    const eager = o.eager ? ` loading="eager" fetchpriority="high"` : ` loading="lazy" fetchpriority="low"`;
    let url = esc(src), extra = "";
    if (o.small) {
      if (isLocal(src)) { url = esc(smallLocal(src)); extra = ` data-full="${esc(src)}"`; }
      else url = esc(smallDrive(src));
    }
    return `<img src="${url}" alt="${esc(FK.carName(c))}" width="800" height="600"${eager} decoding="async" data-car="${esc(c.id)}"${extra} onload="this.classList.add('is-loaded')" onerror="FK.imgFail(this)">`;
  };
  FK.imgFail = (img) => {
    // المرحلة 1: النسخة الصغيرة مش موجودة ← جرّب الصورة الأصلية
    if (img.dataset.full && !img.dataset.retry) { img.dataset.retry = "1"; img.src = img.dataset.full; return; }
    const c = FK.byId(img.dataset.car);
    if (!c) { img.style.display = "none"; return; }
    img.outerHTML = carSVG({ color: COLORS[c.color] || "#888", body: c.body, brand: c.brand });
  };
  // تحميل مسبق للصور المجاورة بمعرض السيارة — بوقت فراغ المتصفح، وبس إذا الزبون مش موفّر بيانات
  FK.preload = (c, i) => {
    const cn = navigator.connection || {};
    if (cn.saveData || /(^|-)2g$|3g/.test(cn.effectiveType || "")) return;
    const go = () => (c.images || []).forEach((s, k) => { if (Math.abs(k - i) <= 1 && k !== i) { const im = new Image(); im.decoding = "async"; im.src = s; } });
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 300);
  };

  /* ---------- المفضلة ---------- */
  FK.toggleFav = (id) => {
    FK.favs.has(id) ? FK.favs.delete(id) : FK.favs.add(id);
    try { localStorage.setItem("fk_favs", JSON.stringify([...FK.favs])); } catch (e) {}
    document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle("on", FK.favs.has(id)));
    if (FK.onFavChange) FK.onFavChange();
  };

  /* ---------- بطاقة السيارة ---------- */
  FK.card = (c, idx) => {
    const inst = c.sale !== "cash" && c.installment;
    return `<article class="card ${c.status !== "available" ? "is-" + c.status : ""}">
  <div class="card-img" data-open-car="${c.id}">
    ${FK.art(c, 0, { small: true, eager: idx < 2 })}
    <div class="badges"><span class="badge cond-${c.condition}">${t("v_" + c.condition)}</span><span class="badge st-${c.status}">${t("v_" + c.status)}</span></div>
    <button type="button" class="fav ${FK.favs.has(c.id) ? "on" : ""}" data-fav="${c.id}" aria-label="${t("f_saved")}"><i class="fa-solid fa-heart"></i></button>
    ${c.images && c.images.length > 1 ? `<span class="photos"><i class="fa-solid fa-images"></i> ${c.images.length}</span>` : ""}
    ${c.sale !== "cash" ? `<span class="badge inst"><i class="fa-solid fa-calendar-check"></i> ${t("tab_install")}</span>` : ""}
  </div>
  <div class="card-body">
    <div class="card-title"><h3>${esc(FK.carName(c))}</h3><span class="yr">${c.year}</span></div>
    <ul class="mini-specs">
      <li><i class="fa-solid fa-gas-pump"></i>${t("v_" + c.fuel)}</li>
      <li><i class="fa-solid fa-gears"></i>${t("v_" + c.transmission)}</li>
      <li><span class="sw" style="--c:${COLORS[c.color] || "#888"}"></span>${t("c_" + c.color)}</li>
      <li><i class="fa-solid fa-gauge-high"></i>${num(c.mileage)} ${t("km")}</li>
    </ul>
    <div class="card-foot">
      <div class="price-box"><div class="price">${money(c.price)}</div>${inst ? `<div class="price-sub">${t("m_from")} ${money(c.installment.monthly)} ${t("per_month")}</div>` : ""}</div>
      <button type="button" class="btn dark sm" data-open-car="${c.id}">${t("view_details")}</button>
    </div>
  </div>
</article>`;
  };

  /* ---------- رابط واتساب ---------- */
  FK.waLink = (c, mode, offer) => {
    const lines = [t("wa_hello"), "",
      `${t("wa_name")}: ${FK.carName(c)}`,
      `${t("wa_id")}: ${c.id}`,
      `${t("wa_type")}: ${t("b_" + c.body)}`,
      `${t("wa_brand")}: ${c.brand}`,
      `${t("wa_year")}: ${c.year}`,
      `${t("wa_price")}: ${money(offer && offer.offerPrice ? offer.offerPrice : c.price)}`];
    if (mode) lines.push(`${t("wa_mode")}: ${mode === "installment" ? t("wa_inst") : t("wa_cash")}`);
    if (offer) lines.push(`${t("wa_offer")}: ${L(offer.title)}`);
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  };
  FK.waGeneral = () => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t("wa_general"))}`;

  /* ---------- النوافذ ---------- */
  const modal = $("#modal"), host = $("#sheetHost");
  // قفل سكرول الخلفية: الصفحة بتتجمّد مكانها وبتتحرك النافذة لحالها (بتشتغل كمان على آيفون)
  let lockY = 0, locked = false;
  const lockPage = () => {
    if (locked) return; locked = true; lockY = window.scrollY;
    const b = document.body.style;
    b.position = "fixed"; b.top = -lockY + "px"; b.left = "0"; b.right = "0"; b.width = "100%";
  };
  const unlockPage = () => {
    if (!locked) return; locked = false;
    const b = document.body.style;
    b.position = b.top = b.left = b.right = b.width = "";
    window.scrollTo(0, lockY);
  };
  FK.openModal = (html, cls) => {
    host.innerHTML = `<div class="sheet ${cls || ""}" role="dialog" aria-modal="true">${html}</div>`;
    lockPage(); modal.classList.add("open"); document.body.classList.add("lock"); modal.scrollTop = 0;
  };
  FK.closeModal = () => { modal.classList.remove("open"); document.body.classList.remove("lock"); host.innerHTML = ""; unlockPage(); };

  FK.openLegal = (kind) => {
    const body = I18N[FK.lang][kind + "_body"] || [];
    FK.openModal(`<button class="x" data-close aria-label="${t("close")}"><i class="fa-solid fa-xmark"></i></button>
      <div class="legal"><h2>${t(kind + "_title")}</h2>${body.map((p) => `<p>${p}</p>`).join("")}</div>`, "narrow");
  };

  FK.galGo = (i) => {
    const c = FK.byId(FK.galCar); if (!c || !c.images || c.images.length < 2) return;
    const n = c.images.length; FK.galIdx = ((i % n) + n) % n;
    const st = $("#galStage"); if (st) st.innerHTML = FK.art(c, FK.galIdx, { eager: true });
    FK.preload(c, FK.galIdx);
    const ct = $("#galCount"); if (ct) ct.textContent = (FK.galIdx + 1) + " / " + n;
    host.querySelectorAll("[data-thumb]").forEach((b) => b.classList.toggle("on", +b.dataset.thumb === FK.galIdx));
  };

  FK.openCar = (id) => {
    const c = FK.byId(id); if (!c) return;
    const avail = c.status === "available";
    const inst = c.sale !== "cash" && c.installment;
    const specs = [
      ["sp_location", L(c.location)], ["sp_trans", t("v_" + c.transmission)],
      ["sp_year", c.year], ["sp_card", c.cardYear || c.year],
      ["sp_cyl", t("cyl_unit", { n: c.cylinders })], ["sp_cc", `<span dir="ltr">${num(c.engineCC || 0)} cc</span>`],
      ["sp_status", `<span class="pill st-${c.status}">${t("v_" + c.status)}</span>`],
      ["sp_seats", c.seats], ["sp_doors", c.doors],
      ["sp_aspiration", t("v_" + c.aspiration)], ["sp_drive", t("v_" + c.drive)],
      ["sp_tank", c.tank + " " + t("liter")],
      ["sp_painted", c.paintedParts ? t("piece_n", { n: c.paintedParts }) : t("no_paint")],
      ["sp_safety", L(c.safety) || "—"],
      ["sp_color", `<span class="sw" style="--c:${COLORS[c.color] || "#888"}"></span>${t("c_" + c.color)}`],
      ["sp_fuel", t("v_" + c.fuel)], ["sp_km", num(c.mileage) + " " + t("km")],
      ["sp_cond", t("v_" + c.condition)], ["sp_import", L(c.imported) || "—"],
      ["sp_nego", c.negotiable ? t("yes") : t("no")], ["sp_category", L(c.category) || "—"],
      ["sp_plate", c.plate || "—"], ["sp_chassis", c.chassis || "—"], ["sp_engine", c.engineNo || "—"],
    ];
    const imgs = c.images || [];
    const many = imgs.length > 1, rtl = FK.lang === "ar";
    FK.galCar = c.id; FK.galIdx = 0;
    setTimeout(() => FK.preload(c, 0), 50);
    const nav = many ? `<button type="button" class="gal-nav prev" data-gal="-1" aria-label="prev"><i class="fa-solid fa-chevron-${rtl ? "right" : "left"}"></i></button><button type="button" class="gal-nav next" data-gal="1" aria-label="next"><i class="fa-solid fa-chevron-${rtl ? "left" : "right"}"></i></button><span class="gal-count" id="galCount">1 / ${imgs.length}</span>` : "";
    const gal = `<div class="gal"><div class="gal-main" id="galMain"><div class="gal-stage" id="galStage">${FK.art(c, 0, { eager: true })}</div>${nav}</div>${
      many ? `<div class="gal-thumbs" id="galThumbs">${imgs.map((s, i) => `<button type="button" data-thumb="${i}" class="${i === 0 ? "on" : ""}"><img src="${esc(smallDrive(s))}" alt="" width="120" height="90" loading="lazy" decoding="async" onerror="this.parentNode.remove()"></button>`).join("")}</div>` : ""}</div>`;

    let orders = "";
    if (!avail) orders = `<div class="unavail"><i class="fa-solid fa-circle-info"></i> ${t("m_unavailable")}</div><a class="btn wa" target="_blank" rel="noopener" href="${FK.waGeneral()}"><i class="fa-brands fa-whatsapp"></i> ${t("m_ask")}</a>`;
    else if (c.sale === "both") orders = `<a class="btn wa" target="_blank" rel="noopener" href="${FK.waLink(c, "cash")}"><i class="fa-brands fa-whatsapp"></i> ${t("m_order_cash_only")}</a><a class="btn dark" target="_blank" rel="noopener" href="${FK.waLink(c, "installment")}"><i class="fa-brands fa-whatsapp"></i> ${t("m_order_inst")}</a>`;
    else orders = `<a class="btn wa" target="_blank" rel="noopener" href="${FK.waLink(c, c.sale)}"><i class="fa-brands fa-whatsapp"></i> ${t("m_order_cash")}</a>`;

    FK.openModal(`<button class="x" data-close aria-label="${t("close")}"><i class="fa-solid fa-xmark"></i></button>
<div class="car-top">
  ${gal}
  <div class="info">
    <div class="eyebrow">${t("m_specs")}</div>
    <h2>${esc(FK.carName(c))}</h2>
    <div class="meta">
      <span>${t("m_id")}: <b dir="ltr">${esc(c.id)}</b> <button type="button" class="copy" data-copy="${esc(c.id)}" title="${t("m_copy")}"><i class="fa-regular fa-copy"></i></button></span>
      <span>${t("m_model")} <b>${c.year}</b></span>
    </div>
    <div class="m-price"><span class="price">${money(c.price)}</span>${c.negotiable ? `<span class="nego">${t("m_negotiable")}</span>` : ""}</div>
    ${inst ? `<div class="plan"><h4><i class="fa-solid fa-calendar-check"></i> ${t("m_plan")}</h4>
      <div><span>${t("m_down")}</span><b>${money(c.installment.down)}</b></div>
      <div><span>${t("m_monthly")}</span><b>${money(c.installment.monthly)}</b></div>
      <div><span>${t("m_months")}</span><b>${c.installment.months} ${t("month_unit")}</b></div></div>` : ""}
    <div class="orders">${orders}</div>
  </div>
</div>
<div class="car-bottom">
  <h3>${t("m_desc")}</h3><p class="desc">${esc(L(c.desc))}</p>
  <h3>${t("m_specs")}</h3>
  <div class="specs">${specs.map(([k, v]) => `<div class="spec"><span>${t(k)}</span><b>${v}</b></div>`).join("")}</div>
</div>`);
  };

  /* ---------- أحداث عامة (تعمل على كل الصفحات) ---------- */
  document.addEventListener("click", (e) => {
    const g = (s) => e.target.closest(s);
    let el;
    if ((el = g("[data-fav]"))) { FK.toggleFav(el.dataset.fav); return; }
    if ((el = g("[data-copy]"))) {
      const done = () => { el.classList.add("ok"); el.innerHTML = '<i class="fa-solid fa-check"></i>'; setTimeout(() => { el.classList.remove("ok"); el.innerHTML = '<i class="fa-regular fa-copy"></i>'; }, 1400); };
      try { navigator.clipboard.writeText(el.dataset.copy).then(done, () => {}); } catch (err) {}
      return;
    }
    if ((el = g("[data-gal]"))) { FK.galGo(FK.galIdx + +el.dataset.gal); return; }
    if ((el = g("[data-thumb]"))) { FK.galGo(+el.dataset.thumb); return; }
    if ((el = g("[data-open-car]"))) { FK.openCar(el.dataset.openCar); return; }
    if ((el = g("[data-legal]"))) { FK.openLegal(el.dataset.legal); return; }
    if (g("[data-close]") || e.target === modal) FK.closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") FK.closeModal();
    if (modal.classList.contains("open") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      const fwd = (e.key === "ArrowRight") === (FK.lang !== "ar");
      FK.galGo(FK.galIdx + (fwd ? 1 : -1));
    }
  });
  let tx = null;
  host.addEventListener("touchstart", (e) => { tx = e.target.closest("#galMain") ? e.touches[0].clientX : null; }, { passive: true });
  host.addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) < 45) return;
    FK.galGo(FK.galIdx + ((dx < 0) === (FK.lang !== "ar") ? 1 : -1));
  });
  FK.refreshRate();
})();
