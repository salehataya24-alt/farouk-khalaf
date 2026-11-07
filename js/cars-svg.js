/* =====================================================================
   cars-svg.js — يرسم سيارة من الأمام تلقائياً (بدل الصور) حسب اللون والنوع.
   لما تحط صور حقيقية بالـ data.js ما بيستعمل هالملف لهالسيارة.
   ===================================================================== */
let __svgId = 0;

// تفتيح (+) أو تغميق (-) لون: amt بين -1 و 1
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((f - r) * p + r); g = Math.round((f - g) * p + g); b = Math.round((f - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const GRILLE_BY_BRAND = {
  bmw: "twin", mercedes: "wide", "mercedes-benz": "wide", audi: "frame", dodge: "bar",
  toyota: "bar", hyundai: "frame", kia: "mesh", ford: "wide",
};

const BODY_SHAPES = {
  sedan:     { roof: 50, ct: [128, 272], cb: [96, 304],  cy: 116, top: 116, bot: 196 },
  hatchback: { roof: 44, ct: [116, 284], cb: [96, 304],  cy: 116, top: 116, bot: 196 },
  suv:       { roof: 28, ct: [104, 296], cb: [88, 312],  cy: 110, top: 108, bot: 198 },
  pickup:    { roof: 38, ct: [112, 288], cb: [90, 310],  cy: 112, top: 110, bot: 198 },
  coupe:     { roof: 68, ct: [148, 252], cb: [104, 296], cy: 120, top: 120, bot: 196 },
};

function carSVG(opt) {
  const color = opt.color || "#c8141e";
  const sh = BODY_SHAPES[opt.body] || BODY_SHAPES.sedan;
  const grille = opt.grille || GRILLE_BY_BRAND[String(opt.brand || "").toLowerCase()] || "bar";
  const id = "c" + (++__svgId);
  const { roof, ct, cb, cy, top, bot } = sh;
  const wy = top + 52;
  const chrome = "#c4c8ce";
  const dark = "#0b0b0c";
  const mx = (x) => 400 - x;
  const hy = top + 14;           // ارتفاع الفانوس
  const gy = top + 24, gh = 32;  // موقع وحجم الشبك

  // الشبك الأمامي حسب الماركة
  let grl = "";
  if (grille === "twin") {
    const L = [[164, gy], [197, gy], [195, gy + gh], [170, gy + gh]];
    const R = L.map(([x, y]) => [mx(x), y]);
    const poly = (p) => `<polygon points="${p.map((q) => q.join(",")).join(" ")}" fill="${dark}" stroke="${chrome}" stroke-width="2.5" stroke-linejoin="round"/>`;
    let slats = "";
    for (let k = 1; k <= 3; k++) {
      const y = gy + (gh * k) / 4;
      slats += `<line x1="168" y1="${y}" x2="195" y2="${y}" stroke="#3a3d42" stroke-width="1.4"/><line x1="${mx(195)}" y1="${y}" x2="${mx(168)}" y2="${y}" stroke="#3a3d42" stroke-width="1.4"/>`;
    }
    grl = poly(L) + poly(R) + slats;
  } else if (grille === "wide") {
    grl = `<polygon points="150,${gy} 250,${gy} 244,${gy + gh} 156,${gy + gh}" fill="${dark}" stroke="${chrome}" stroke-width="2.5" stroke-linejoin="round"/>` +
      [1, 2, 3].map((k) => `<line x1="${154 + k}" y1="${gy + (gh * k) / 4}" x2="${246 - k}" y2="${gy + (gh * k) / 4}" stroke="${chrome}" stroke-width="3"/>`).join("");
  } else if (grille === "frame") {
    let g = `<polygon points="158,${gy - 2} 242,${gy - 2} 232,${gy + gh + 2} 168,${gy + gh + 2}" fill="${dark}" stroke="${chrome}" stroke-width="3" stroke-linejoin="round"/>`;
    for (let x = 174; x <= 226; x += 8) g += `<line x1="${x}" y1="${gy + 2}" x2="${x}" y2="${gy + gh - 1}" stroke="#4a4d52" stroke-width="1"/>`;
    for (let k = 1; k <= 3; k++) g += `<line x1="164" y1="${gy + (gh * k) / 4}" x2="236" y2="${gy + (gh * k) / 4}" stroke="#4a4d52" stroke-width="1"/>`;
    grl = g;
  } else if (grille === "mesh") {
    let g = `<rect x="156" y="${gy}" width="88" height="${gh}" rx="9" fill="${dark}" stroke="${chrome}" stroke-width="2.5"/>`;
    for (let x = 166; x < 244; x += 10) g += `<line x1="${x}" y1="${gy + 3}" x2="${x}" y2="${gy + gh - 3}" stroke="#4a4d52" stroke-width="1"/>`;
    for (let y = gy + 8; y < gy + gh; y += 8) g += `<line x1="160" y1="${y}" x2="240" y2="${y}" stroke="#4a4d52" stroke-width="1"/>`;
    grl = g;
  } else { // bar
    grl = `<rect x="150" y="${gy}" width="100" height="3.5" rx="1.5" fill="${chrome}"/>` +
      `<rect x="146" y="${gy + 8}" width="108" height="18" rx="4" fill="${dark}" stroke="${chrome}" stroke-width="2.5"/>` +
      `<line x1="150" y1="${gy + 17}" x2="250" y2="${gy + 17}" stroke="#3a3d42" stroke-width="1.5"/>`;
  }

  // الفوانيس
  const lamp = (m) => {
    const X = (x) => (m ? mx(x) : x);
    return `<polygon points="${X(66)},${hy} ${X(150)},${hy + 8} ${X(150)},${hy + 26} ${X(72)},${hy + 24}" fill="#eef1f4"/>` +
      `<polygon points="${X(76)},${hy + 6} ${X(142)},${hy + 13} ${X(142)},${hy + 22} ${X(80)},${hy + 19}" fill="#161a1f"/>` +
      `<line x1="${X(72)}" y1="${hy + 3}" x2="${X(148)}" y2="${hy + 10}" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`;
  };

  return `<svg class="car-svg" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
<defs>
 <linearGradient id="gl${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46505e"/><stop offset="1" stop-color="#0e1218"/></linearGradient>
 <linearGradient id="sh${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
</defs>
<ellipse cx="200" cy="216" rx="172" ry="11" fill="#000" opacity=".5"/>
<rect x="44" y="${wy}" width="48" height="${216 - wy}" rx="11" fill="#0d0d0e"/><rect x="308" y="${wy}" width="48" height="${216 - wy}" rx="11" fill="#0d0d0e"/>
<polygon points="${cb[0]},${cy} ${ct[0]},${roof} ${ct[1]},${roof} ${cb[1]},${cy}" fill="${color}" stroke="${color}" stroke-width="10" stroke-linejoin="round"/>
<polygon points="${cb[0] + 14},${cy - 2} ${ct[0] + 14},${roof + 13} ${ct[1] - 14},${roof + 13} ${cb[1] - 14},${cy - 2}" fill="url(#gl${id})"/>
<polygon points="${ct[0] + 20},${roof + 13} ${ct[0] + 62},${roof + 13} ${cb[0] + 38},${cy - 2} ${cb[0] + 14},${cy - 2}" fill="#fff" opacity=".09"/>
<rect x="58" y="${top}" width="284" height="${bot - top}" rx="30" fill="${color}"/>
<rect x="58" y="${top}" width="284" height="${bot - top}" rx="30" fill="url(#sh${id})"/>
<path d="M72 ${top + 6} Q200 ${top - 8} 328 ${top + 6} L318 ${top + 22} Q200 ${top + 8} 82 ${top + 22} Z" fill="#fff" opacity=".13"/>
<rect x="68" y="${cy - 8}" width="20" height="14" rx="5" fill="${shade(color, -0.2)}"/><rect x="312" y="${cy - 8}" width="20" height="14" rx="5" fill="${shade(color, -0.2)}"/>
${lamp(false)}${lamp(true)}
${grl}
<path d="M92 ${bot - 22} Q200 ${bot - 30} 308 ${bot - 22} L296 ${bot - 2} Q200 ${bot + 2} 104 ${bot - 2} Z" fill="${dark}"/>
<rect x="174" y="${bot - 17}" width="52" height="13" rx="2" fill="#eceef0"/>
<circle cx="112" cy="${bot - 12}" r="5" fill="#cfd6de"/><circle cx="288" cy="${bot - 12}" r="5" fill="#cfd6de"/>
</svg>`;
}
