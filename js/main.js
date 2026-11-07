/* =====================================================================
   main.js — الهيدر، الفوتر، التنقل بين الصفحات، البداية
   ===================================================================== */
(function () {
  const t = FK.t, L = FK.L, esc = FK.esc;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROUTES = ["home", "shop", "offers", "contact"];
  const NAV_ICONS = { home: "house", shop: "car-side", offers: "tags", contact: "phone" };
  const route = () => { const h = location.hash.replace("#", ""); return ROUTES.includes(h) ? h : "home"; };

  function applyLang() {
    document.documentElement.lang = FK.lang;
    document.documentElement.dir = FK.lang === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  }

  function chrome() {
    const r = route();
    const langFlag = FK.lang === "ar" ? "img/lang/en.webp" : "img/lang/ar.webp";
    $("#hdr").innerHTML = `<div class="wrap hdr-in">
  <a class="logo" href="#home"><img class="logo-img" src="${ASSETS.logo}" alt="Farouk Khalaf" fetchpriority="high" decoding="async"></a>
  <nav class="nav" id="nav">${ROUTES.map((k, i) => `<a href="#${k}" class="nv ${r === k ? "on" : ""}" style="--i:${i}"><span class="nv-n">0${i + 1}</span><i class="fa-solid fa-${NAV_ICONS[k]} ic"></i><span class="nv-t">${t("nav_" + k)}</span></a>`).join("")}<div class="nav-foot"><a class="btn wa" target="_blank" rel="noopener" href="${FK.waGeneral()}"><i class="fa-brands fa-whatsapp"></i> ${t("cta_wa")}</a></div></nav>
  <button type="button" class="lang" id="langBtn" aria-label="Language"><img class="lang-flag" src="${langFlag}" alt="" width="20" height="15"><span>${t("lang_btn")}</span></button>
  <button type="button" class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
</div>`;
    $("#ftr").innerHTML = `<div class="wrap ft-grid">
  <div class="ft-brand"><a class="logo" href="#home"><img class="logo-img" src="${ASSETS.logo}" alt="Farouk Khalaf" loading="lazy" decoding="async"></a><p>${t("ft_about")}</p>
    <div class="socials"><a target="_blank" rel="noopener" href="${FK.waGeneral()}" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a><a target="_blank" rel="noopener" href="${SITE.facebook}" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a><a target="_blank" rel="noopener" href="${SITE.instagram}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></div></div>
  <div><h4>${t("ft_links")}</h4><ul>${ROUTES.map((k) => `<li><a href="#${k}">${t("nav_" + k)}</a></li>`).join("")}</ul></div>
  <div><h4>${t("ft_contact")}</h4><ul class="ft-contact">
    <li><i class="fa-solid fa-location-dot"></i>${esc(L(SITE.address))}</li>
    <li><i class="fa-brands fa-whatsapp"></i><span dir="ltr">${SITE.whatsappText}</span></li>
    <li><i class="fa-regular fa-clock"></i>${esc(L(SITE.hours))}</li></ul></div>
</div>
<div class="ft-bar"><div class="wrap"><span>${t("ft_rights", { y: new Date().getFullYear() })}</span>
  <span class="ft-legal"><button type="button" data-legal="privacy">${t("ft_privacy")}</button><button type="button" data-legal="terms">${t("ft_terms")}</button></span></div></div>`;
    $("#langBtn").onclick = () => setLang(FK.lang === "ar" ? "en" : "ar");
    const nav = $("#nav"), burger = $("#burger");
    const closeNav = () => { nav.classList.remove("open"); burger.classList.remove("on"); burger.setAttribute("aria-expanded", "false"); burger.innerHTML = '<i class="fa-solid fa-bars"></i>'; document.body.classList.remove("lock-m"); };
    burger.onclick = () => {
      const open = nav.classList.toggle("open");
      burger.classList.toggle("on", open); burger.setAttribute("aria-expanded", open);
      burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      document.body.classList.toggle("lock-m", open);
    };
    nav.onclick = closeNav;
  }

  /* الهيدر بيصير غامق لما تنزل بالصفحة (حدث واحد خفيف) */
  const hdrEl = $("#hdr");
  let solid = null;
  const onScroll = () => { const s = window.scrollY > 30; if (s !== solid) { solid = s; hdrEl.classList.toggle("solid", s); } };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- الرسم والتنقل ---------- */
  function render() {
    FK.closeModal();
    const r = route();
    chrome();
    $("#view").innerHTML = FK.views[r]();
    document.body.dataset.page = r;
    document.body.classList.remove("lock-m");
    (FK.after[r] || (() => {}))();
    window.scrollTo(0, 0);
    onScroll();
    const h = $("#hero");
    if (h) requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add("go")));
  }

  function setLang(l) {
    FK.lang = l;
    try { localStorage.setItem("fk_lang", l); } catch (e) {}
    if (window.loadFonts) loadFonts(l);   // خطوط اللغة الجديدة بس
    applyLang(); render();
  }

  /* انتقال الستارة: بتنزل، بنبدّل الصفحة وهي مغطّية الشاشة، وبتطلع */
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let busy = false;
  function navigate() {
    const cur = $("#curtain");
    if (RM || busy || !cur) { render(); return; }
    busy = true; cur.classList.remove("out"); cur.classList.add("in");
    setTimeout(() => {
      render();
      cur.classList.add("out"); cur.classList.remove("in");
      setTimeout(() => { cur.style.transition = "none"; cur.classList.remove("out"); void cur.offsetWidth; cur.style.transition = ""; busy = false; }, 520);
    }, 480);
  }
  window.addEventListener("hashchange", navigate);

  /* ---------- بداية الموقع ---------- */
  // الرئيسية ما فيها سيارات، فما في داعي نعيد رسمها (وبالتالي ما بنعيد تحميل الفيديو واللوغو)
  FK.rerender = () => { if (route() !== "home") { applyLang(); render(); } };
  applyLang(); render();
  Promise.resolve(window.CARS_READY).then((changed) => { if (changed === true) FK.rerender(); }).catch(() => {});

  if ("serviceWorker" in navigator) { window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); }, { once: true }); }
})();
