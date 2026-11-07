/* =====================================================================
   shop.js — صفحة المعرض: بحث وفلترة سهلة وكاملة
   • بحث واحد بيفهم الاسم، الماركة، السنة، رقم المعرّف، اللون، النوع (بالعربي والإنكليزي)
   • سعر من/إلى: بيقبل أرقام عربية أو إنكليزية وبيعرضها إنكليزي، بالدولار أو الدرهم
   • فلاتر بضغطة وحدة: ماركة، هيكل، حالة، بيع، وقود، ناقل حركة، دفع، لون، سنة، كيلومترات
   ===================================================================== */
(function () {
  const t = FK.t, num = FK.num, esc = FK.esc;
  const $ = (s, r = document) => r.querySelector(s);
  const PAGE = 12;

  const BLANK = () => ({ q: "", min: "", max: "", brand: "all", body: "all", cond: "all", sale: "all", fuel: "all", trans: "all",
    drive: "all", color: "all", yfrom: "", yto: "", km: 0, avail: false, fav: false });
  const S = Object.assign(BLANK(), { sort: "new", limit: PAGE });

  /* ---------- أرقام: عربي/فارسي → إنكليزي، وفواصل الآلاف ---------- */
  const toEn = (s) => String(s)
    .replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c))
    .replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
    .replace(/[٬,،]/g, "");
  const digits = (s) => toEn(s).replace(/[^\d]/g, "");
  const fmt = (d) => (d ? Number(d).toLocaleString("en-US") : "");
  const sym = () => (FK.cur === "AED" ? "AED" : "$");
  const priceNow = (c) => (FK.cur === "AED" ? Math.round(c.price * FK.rate) : c.price);

  /* اسم أي قيمة بالعربي والإنكليزي معاً (حتى يلاقيها البحث مهما كانت اللغة) */
  const both = (k) => ((I18N.ar && I18N.ar[k]) || "") + " " + ((I18N.en && I18N.en[k]) || "");
  const hayOf = (c) => [c.brand, c.model, c.brand_ar, c.model_ar, c.id, c.numId, c.year, both("b_" + c.body), both("c_" + c.color), both("v_" + c.fuel),
    both("v_" + c.transmission), both("v_" + c.drive), both("v_" + c.condition)].join(" ").toLowerCase();

  function match(c) {
    if (S.avail && c.status !== "available") return false;
    if (S.fav && !FK.favs.has(c.id)) return false;
    if (S.cond !== "all" && c.condition !== S.cond) return false;
    if (S.sale === "cash" && c.sale === "installment") return false;
    if (S.sale === "installment" && c.sale === "cash") return false;
    if (S.brand !== "all" && c.brand !== S.brand) return false;
    if (S.body !== "all" && c.body !== S.body) return false;
    if (S.fuel !== "all" && c.fuel !== S.fuel) return false;
    if (S.trans !== "all" && c.transmission !== S.trans) return false;
    if (S.drive !== "all" && c.drive !== S.drive) return false;
    if (S.color !== "all" && c.color !== S.color) return false;
    if (S.yfrom && c.year < +S.yfrom) return false;
    if (S.yto && c.year > +S.yto) return false;
    if (S.km && c.mileage > S.km) return false;
    const p = priceNow(c);
    if (S.min && p < +S.min) return false;
    if (S.max && p > +S.max) return false;
    if (S.q) {
      const hay = hayOf(c);
      if (!toEn(S.q).toLowerCase().trim().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }
  const SORTS = {
    new: (x, y) => y.year - x.year, old: (x, y) => x.year - y.year,
    plow: (x, y) => x.price - y.price, phigh: (x, y) => y.price - x.price, kmlow: (x, y) => x.mileage - y.mileage,
  };
  const build = () => CARS.filter(match).sort(SORTS[S.sort]);

  /* ------------------------------ الصفحة ------------------------------ */
  const uniq = (key) => [...new Set(CARS.map((c) => c[key]))];
  const years = () => { const y = CARS.map((c) => c.year); const a = Math.min(...y), b = Math.max(...y); const r = []; for (let i = b; i >= a; i--) r.push(i); return r; };
  const KMS = [10000, 30000, 60000, 100000, 150000];
  const PRICE_STEPS = [15000, 25000, 35000, 50000]; // بالدولار، بتتحول تلقائياً للدرهم

  const chip = (f, cur, v, label) => `<button type="button" class="qbtn ${cur === v ? "on" : ""}" data-f="${f}" data-v="${esc(v)}">${label}</button>`;
  // مجموعة أزرار: بتختفي إذا ما في خيارين على الأقل
  const group = (title, f, values, labelFn) => values.length < 2 ? "" :
    `<div class="fx-block"><div class="fx-label">${title}</div><div class="quick">${chip(f, S[f], "all", t("f_all"))}${values.map((v) => chip(f, S[f], v, labelFn(v))).join("")}</div></div>`;
  const colorGroup = () => {
    const cols = uniq("color"); if (cols.length < 2) return "";
    return `<div class="fx-block"><div class="fx-label">${t("f_color")}</div><div class="quick">${chip("color", S.color, "all", t("f_all"))}${cols.map((v) =>
      `<button type="button" class="qbtn ${S.color === v ? "on" : ""}" data-f="color" data-v="${v}"><span class="sw" style="--c:${COLORS[v] || "#888"}"></span> ${t("c_" + v)}</button>`).join("")}</div></div>`;
  };
  const quickPrice = () => PRICE_STEPS.map((usd) => {
    const v = FK.cur === "AED" ? Math.round((usd * FK.rate) / 1000) * 1000 : usd;
    return `<button type="button" class="qbtn" data-qp="${v}">${t("fx_under", { p: (FK.cur === "AED" ? "" : "$") + num(v) + (FK.cur === "AED" ? " " + sym() : "") })}</button>`;
  }).join("");

  const rateNote = () => t(FK.rateLive ? "fx_rate_live" : "fx_rate", { r: FK.rate.toFixed(4) });

  FK.views.shop = () => `
<section class="page-head"><div class="wrap"><h1>${t("shop_title")}</h1><p>${t("shop_sub")}</p></div></section>
<section class="wrap shop-wrap">
  <div class="fx-top">
    <label class="search fx-search"><i class="fa-solid fa-magnifying-glass"></i><input type="search" data-in="q" value="${esc(S.q)}" placeholder="${t("fx_search_ph")}" autocomplete="off"></label>
    <button type="button" class="fx-btn" data-open-filter aria-haspopup="dialog"><i class="fa-solid fa-sliders"></i><span>${t("fx_filter")}</span><b class="fx-badge" id="fxBadge" hidden>0</b></button>
  </div>
  <div class="fx-active" id="active" hidden></div>

  <div class="fx-panel" id="fxPanel" role="dialog" aria-modal="true" aria-label="${t("fx_filter")}">
    <div class="fx-backdrop" data-close-filter></div>
    <div class="fx-sheet">
      <div class="fx-head"><h2>${t("fx_filter")}</h2><button type="button" class="fx-x" data-close-filter aria-label="${t("close")}"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="fx-body">
        <div class="fx-block fx-pricebox">
          <div class="fx-label">${t("f_price")} <span class="fx-hint">${t("fx_digits_hint")}</span></div>
          <div class="fx-price">
            <div class="budget-input"><span class="fx-k">${t("f_min")}</span><span class="sym" data-sym>${sym()}</span><input type="text" inputmode="numeric" autocomplete="off" data-num="min" value="${fmt(S.min)}" placeholder="0"></div>
            <div class="budget-input"><span class="fx-k">${t("f_max")}</span><span class="sym" data-sym>${sym()}</span><input type="text" inputmode="numeric" autocomplete="off" data-num="max" value="${fmt(S.max)}" placeholder="∞"></div>
          </div>
          <div class="cur-seg" role="group">
            <button type="button" class="${FK.cur === "USD" ? "on" : ""}" data-cur="USD">${t("cur_usd")}</button>
            <button type="button" class="${FK.cur === "AED" ? "on" : ""}" data-cur="AED">${t("cur_aed")}</button>
          </div>
          <div class="quick fx-qp" id="qp">${quickPrice()}</div>
          <p class="fx-rate" id="rateNote">${rateNote()}</p>
        </div>

        ${group(t("f_body"), "body", uniq("body"), (v) => t("b_" + v))}
        ${group(t("f_condition"), "cond", ["new", "used"], (v) => t("v_" + v))}
        ${group(t("fx_sale"), "sale", ["cash", "installment"], (v) => t("tab_" + (v === "cash" ? "cash" : "install")))}
        <div class="fx-block fx-selects fx-years">
          <label><span class="fx-label">${t("fx_yfrom")}</span><select data-sel="yfrom"><option value="">${t("fx_anyyear")}</option>${years().map((y) => `<option value="${y}" ${S.yfrom == y ? "selected" : ""}>${y}</option>`).join("")}</select></label>
          <label><span class="fx-label">${t("fx_yto")}</span><select data-sel="yto"><option value="">${t("fx_anyyear")}</option>${years().map((y) => `<option value="${y}" ${S.yto == y ? "selected" : ""}>${y}</option>`).join("")}</select></label>
        </div>

        <div class="fx-sub">${t("fx_more")}</div>
        ${group(t("f_brand"), "brand", uniq("brand"), (v) => esc(v))}
        ${group(t("f_fuel"), "fuel", uniq("fuel"), (v) => t("v_" + v))}
        ${group(t("f_trans"), "trans", uniq("transmission"), (v) => t("v_" + v))}
        ${group(t("f_drive"), "drive", uniq("drive"), (v) => t("v_" + v))}
        ${colorGroup()}
        <div class="fx-block fx-selects">
          <label><span class="fx-label">${t("f_km")}</span><select data-sel="km"><option value="0">${t("f_any")}</option>${KMS.map((k) => `<option value="${k}" ${S.km === k ? "selected" : ""}>${t("f_up_to", { n: num(k) })}</option>`).join("")}</select></label>
        </div>
        <div class="fx-block quick">
          <label class="fx-check"><input type="checkbox" data-chk="avail" ${S.avail ? "checked" : ""}><span>${t("f_avail_only")}</span></label>
          <label class="fx-check"><input type="checkbox" data-chk="fav" ${S.fav ? "checked" : ""}><span><i class="fa-solid fa-heart"></i> ${t("f_saved")}</span></label>
        </div>
      </div>
      <div class="fx-foot">
        <button type="button" class="btn ghost-dark sm" id="clearAll2"><i class="fa-solid fa-rotate-left"></i> ${t("reset")}</button>
        <button type="button" class="btn red" data-close-filter id="fxShow"></button>
      </div>
    </div>
  </div>

  <div class="toolbar">
    <div class="count" id="count"></div>
    <div class="tb-right"><label class="sort"><span>${t("sort")}</span><select data-sort>${["new", "old", "plow", "phigh", "kmlow"].map((k) => `<option value="${k}" ${S.sort === k ? "selected" : ""}>${t("s_" + k)}</option>`).join("")}</select></label></div>
  </div>
  <div class="grid" id="grid"></div>
  <div class="more" id="more"></div>
</section>`;

  /* ------------------------- الرسم والتحديث ------------------------- */
  let current = [];

  function paintGrid() {
    const g = $("#grid");
    if (!current.length) {
      g.innerHTML = `<div class="empty"><i class="fa-solid fa-car-burst"></i><h3>${t("no_results")}</h3><p>${t("no_results_sub")}</p><button type="button" class="btn dark sm" id="clearAll">${t("reset")}</button></div>`;
      $("#more").innerHTML = ""; return;
    }
    g.innerHTML = current.slice(0, S.limit).map(FK.card).join("");
    $("#more").innerHTML = current.length > S.limit ? `<button type="button" class="btn ghost-dark" id="moreBtn">${t("load_more")} (${current.length - S.limit})</button>` : "";
  }

  // الفلاتر المختارة كأزرار صغيرة، كل واحد بيتشال بضغطة
  function activeChips() {
    const out = [], add = (k, label) => out.push(`<button type="button" class="fx-tag" data-rm="${k}">${label} <i class="fa-solid fa-xmark"></i></button>`);
    if (S.q) add("q", `“${esc(S.q)}”`);
    if (S.min || S.max) add("price", `${t("f_price")}: ${S.min ? fmt(S.min) : "0"} – ${S.max ? fmt(S.max) : "∞"} ${sym()}`);
    if (S.brand !== "all") add("brand", esc(S.brand));
    if (S.body !== "all") add("body", t("b_" + S.body));
    if (S.cond !== "all") add("cond", t("v_" + S.cond));
    if (S.sale !== "all") add("sale", t("tab_" + (S.sale === "cash" ? "cash" : "install")));
    if (S.fuel !== "all") add("fuel", t("v_" + S.fuel));
    if (S.trans !== "all") add("trans", t("v_" + S.trans));
    if (S.drive !== "all") add("drive", t("v_" + S.drive));
    if (S.color !== "all") add("color", t("c_" + S.color));
    if (S.yfrom || S.yto) add("year", `${t("f_year")}: ${S.yfrom || "…"} – ${S.yto || "…"}`);
    if (S.km) add("km", t("f_up_to", { n: num(S.km) }));
    if (S.avail) add("avail", t("f_avail_only"));
    if (S.fav) add("fav", t("f_saved"));
    return out;
  }
  const RM = { price: ["min", "max"], year: ["yfrom", "yto"] };
  const BL = BLANK();

  function update() {
    current = build();
    $("#count").innerHTML = `<b>${t("results", { n: current.length })}</b>`;
    const chips = activeChips(), box = $("#active");
    box.hidden = !chips.length;
    box.innerHTML = chips.length ? chips.join("") + `<button type="button" class="fx-clear" id="clearAll3"><i class="fa-solid fa-rotate-left"></i> ${t("reset")}</button>` : "";
    const bd = $("#fxBadge"); bd.hidden = !chips.length; bd.textContent = chips.length;
    $("#fxShow").textContent = t("show_results", { n: current.length });
    paintGrid();
  }
  FK.after.shop = () => { update(); };
  // لما يوصل سعر الصرف المباشر: حدّث الأسعار والملاحظة
  document.addEventListener("fk:rate", () => {
    if (!$("#grid")) return;
    const n = $("#rateNote"); if (n) n.textContent = rateNote();
    const q = $("#qp"); if (q) q.innerHTML = quickPrice();
    update();
  });
  FK.onFavChange = () => { if (S.fav && $("#grid")) update(); };

  /* ------------------------------ الأحداث ------------------------------ */
  const view = document.getElementById("view");
  const mark = (f) => view.querySelectorAll(`[data-f="${f}"]`).forEach((b) => b.classList.toggle("on", b.dataset.v === S[f]));
  const syncInputs = () => {
    view.querySelectorAll("[data-num]").forEach((i) => { i.value = fmt(S[i.dataset.num]); });
    view.querySelectorAll("[data-in]").forEach((i) => { i.value = S[i.dataset.in]; });
    view.querySelectorAll("[data-sel]").forEach((i) => { i.value = String(S[i.dataset.sel]); });
    view.querySelectorAll("[data-chk]").forEach((i) => { i.checked = !!S[i.dataset.chk]; });
    Object.keys(BL).forEach((k) => { if (typeof BL[k] === "string" && view.querySelector(`[data-f="${k}"]`)) mark(k); });
  };
  const reset = () => { Object.assign(S, BLANK(), { limit: PAGE }); syncInputs(); update(); };

  view.addEventListener("click", (e) => {
    if (!$("#grid")) return;
    const g = (s) => e.target.closest(s); let el;
    if ((el = g("[data-f]"))) { S[el.dataset.f] = el.dataset.v; mark(el.dataset.f); S.limit = PAGE; update(); return; }
    if ((el = g("[data-cur]"))) {
      const from = FK.cur; FK.setCur(el.dataset.cur);
      if (from !== FK.cur) { // نحوّل الأرقام المكتوبة للعملة الجديدة
        const k = FK.cur === "AED" ? FK.rate : 1 / FK.rate;
        ["min", "max"].forEach((x) => { if (S[x]) S[x] = String(Math.round((+S[x] * k) / 10) * 10); });
      }
      view.querySelectorAll("[data-cur]").forEach((b) => b.classList.toggle("on", b.dataset.cur === FK.cur));
      view.querySelectorAll("[data-sym]").forEach((s) => { s.textContent = sym(); });
      $("#qp").innerHTML = quickPrice(); syncInputs(); S.limit = PAGE; update(); return;
    }
    if ((el = g("[data-qp]"))) { S.min = ""; S.max = String(el.dataset.qp); syncInputs(); S.limit = PAGE; update(); return; }
    if ((el = g("[data-rm]"))) {
      (RM[el.dataset.rm] || [el.dataset.rm]).forEach((k) => { S[k] = BL[k]; });
      syncInputs(); S.limit = PAGE; update(); return;
    }
    if (g("[data-open-filter]")) { openPanel(true); return; }
    if (g("[data-close-filter]")) { openPanel(false); return; }
    if (g("#moreBtn")) { S.limit += PAGE; paintGrid(); return; }
    if (g("#clearAll") || g("#clearAll2") || g("#clearAll3")) reset();
  });

  const openPanel = (on) => { const p = $("#fxPanel"); if (!p) return; p.classList.toggle("open", on); document.body.classList.toggle("lock", on); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") openPanel(false); });
  window.addEventListener("hashchange", () => document.body.classList.remove("lock"));

  let timer = 0;
  view.addEventListener("input", (e) => {
    const el = e.target; if (!el.dataset) return;
    if (el.dataset.num) { // سعر: أرقام فقط، إنكليزي، مع فواصل
      const d = digits(el.value); S[el.dataset.num] = d; el.value = fmt(d);
    } else if (el.dataset.in) S[el.dataset.in] = el.value;
    else return;
    S.limit = PAGE; clearTimeout(timer); timer = setTimeout(update, 200);
  });
  view.addEventListener("change", (e) => {
    const el = e.target; if (!el.dataset) return;
    if (el.hasAttribute("data-sort")) S.sort = el.value;
    else if (el.dataset.sel) S[el.dataset.sel] = el.dataset.sel === "km" ? +el.value : el.value;
    else if (el.dataset.chk) S[el.dataset.chk] = el.checked;
    else return;
    S.limit = PAGE; update();
  });
})();
