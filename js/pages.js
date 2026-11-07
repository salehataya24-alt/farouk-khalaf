/* =====================================================================
   pages.js — صفحة العروض + صفحة تواصل معنا
   (العروض بتتعدل من data.js، وبيانات التواصل من SITE بنفس الملف)
   ===================================================================== */
(function () {
  const t = FK.t, L = FK.L, money = FK.money, esc = FK.esc;

  /* ------------------------------ العروض ------------------------------ */
  function dateText(iso) {
    try { return new Date(iso + "T00:00:00").toLocaleDateString(FK.lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return iso; }
  }

  FK.views.offers = () => {
    const items = OFFERS.map((o) => ({ o, c: FK.byId(o.carId) })).filter((x) => x.c);
    const body = items.length
      ? `<div class="offers">${items.map(({ o, c }) => {
          const now = o.offerPrice || c.price;
          return `<article class="offer">
  <div class="offer-img" data-open-car="${c.id}">${FK.art(c, 0, { small: true })}<span class="offer-badge">${esc(o.badge || "")}</span></div>
  <div class="offer-body">
    <h3>${esc(L(o.title))}</h3>
    <p>${esc(L(o.text))}</p>
    <div class="offer-car">${esc(FK.carName(c))} · ${c.year}</div>
    <div class="offer-price"><b>${money(now)}</b>${o.offerPrice ? `<del>${t("offer_was")} <bdi dir="ltr">${money(c.price)}</bdi></del>` : ""}</div>
    ${o.until ? `<div class="offer-until"><i class="fa-regular fa-clock"></i> ${t("offer_until")} ${dateText(o.until)}</div>` : ""}
    <div class="offer-actions">
      <a class="btn wa sm" target="_blank" rel="noopener" href="${FK.waLink(c, c.sale === "installment" ? "installment" : "cash", o)}"><i class="fa-brands fa-whatsapp"></i> ${t("offer_order")}</a>
      <button type="button" class="btn ghost-dark sm" data-open-car="${c.id}">${t("offer_details")}</button>
    </div>
  </div>
</article>`; }).join("")}</div>`
      : `<div class="empty big"><i class="fa-solid fa-tags"></i><h3>${t("offers_empty")}</h3><p>${t("offers_empty_sub")}</p></div>`;
    return `<section class="page-head"><div class="wrap"><h1>${t("offers_title")}</h1><p>${t("offers_sub")}</p></div></section><section class="wrap block">${body}</section>`;
  };

  /* ---------------------------- تواصل معنا ---------------------------- */
  const mapSrc = () => `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=12&output=embed`;
  const mapLink = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`;

  FK.views.contact = () => `
<section class="page-head"><div class="wrap"><h1>${t("contact_title")}</h1><p>${t("contact_sub")}</p></div></section>
<section class="wrap block">
  <div class="channels">
    <a class="ch wa" target="_blank" rel="noopener" href="${FK.waGeneral()}"><span class="ch-ic"><i class="fa-brands fa-whatsapp"></i></span><div><small>${t("c_whatsapp")}</small><b dir="ltr">${SITE.whatsappText}</b></div><em>${t("c_chat")}</em></a>
    <a class="ch fb" target="_blank" rel="noopener" href="${SITE.facebook}"><span class="ch-ic"><i class="fa-brands fa-facebook-f"></i></span><div><small>${t("c_facebook")}</small><b dir="ltr">${esc(SITE.facebookName)}</b></div><em>${t("c_follow")}</em></a>
    <a class="ch ig" target="_blank" rel="noopener" href="${SITE.instagram}"><span class="ch-ic"><i class="fa-brands fa-instagram"></i></span><div><small>${t("c_instagram")}</small><b dir="ltr">${esc(SITE.instagramName)}</b></div><em>${t("c_follow")}</em></a>
    <a class="ch ph" href="tel:${SITE.phoneLink}"><span class="ch-ic"><i class="fa-solid fa-phone"></i></span><div><small>${t("c_phone")}</small><b dir="ltr">${SITE.phoneText}</b></div><em>${t("c_call")}</em></a>
  </div>

  <div class="visit">
    <div class="visit-info">
      <h2>${t("c_visit")}</h2>
      <div class="vi"><i class="fa-solid fa-location-dot"></i><div><small>${t("c_address")}</small><b>${esc(L(SITE.address))}</b></div></div>
      <div class="vi"><i class="fa-regular fa-clock"></i><div><small>${t("c_hours")}</small><b>${esc(L(SITE.hours))}</b></div></div>
      <a class="btn dark" target="_blank" rel="noopener" href="${mapLink()}"><i class="fa-solid fa-diamond-turn-right"></i> ${t("c_open_map")}</a>
    </div>
    <div class="map">
      ${SITE.embedMap ? `<iframe title="${t("c_map")}" src="${mapSrc()}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `
      <div class="map-fake"><div class="pin"><i class="fa-solid fa-location-dot"></i></div><div class="map-tag"><b>${esc(L(SITE.address))}</b></div></div>`}
    </div>
  </div>

  <div class="legal-row">
    <button type="button" data-legal="privacy">${t("ft_privacy")}</button>
    <button type="button" data-legal="terms">${t("ft_terms")}</button>
    <span>${t("ft_rights", { y: new Date().getFullYear() })}</span>
  </div>
</section>`;
})();
