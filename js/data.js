/* =====================================================================
   data.js — إعدادات الموقع العامة (الأرقام، الروابط، مسارات الصور والفيديو)
   السيارات والعروض بملف منفصل: js/cars.js
   ===================================================================== */

// دالة صغيرة للنص ثنائي اللغة: T("عربي", "English")
const T = (ar, en) => ({ ar, en });

/* ---------------------------- أماكن الملفات ----------------------------
   حط الملفات بالمجلدات هاي وهيك بتتحمّل لحالها:

   img/logos/   ← اللوغوات (الهيدر والفوتر)
   img/cars/    ← صور السيارات (بس اكتب اسم الصورة بـ cars.js)
   videos/      ← فيديو الصفحة الرئيسية

   إذا غيّرت اسم ملف، غيّره هون كمان.                                      */
const ASSETS = {
  logo: "img/logos/logo-primary.webp",   // اللوغو بالهيدر والفوتر
  // فيديو الرئيسية: الموقع بيجرّب الأسماء بالترتيب وبيشغّل أول ملف موجود
  heroVideo: "videos/best.mp4",
  // نسخة خفيفة للموبايل (640×480، بتتحمّل بسرعة أكبر على الجوال)
  heroVideoMobile: "",   // فيديو واحد لكل الأجهزة (best.mp4)
  // صورة تظهر فوراً قبل ما الفيديو يجهز (لقطة من الفيديو، حوالي 100KB) — اختيارية
  heroPoster: "img/hero-poster.webp",  // poster shown instantly before video loads
  carsFolder: "img/cars/",              // مجلد صور السيارات
};

/* ---------------------------- إعدادات الشركة ---------------------------- */
const SITE = {
  whatsapp: "971529870702",            // رقم الواتساب بصيغة دولية بدون +
  whatsappText: "+971 52 987 0702",    // الرقم كما بدك يظهر للزبون
  phoneText: "+971 52 987 0702",
  phoneLink: "+971529870702",
  facebook: "https://www.facebook.com/share/19ewDVj4N6/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/farouk_tbo/",
  facebookName: "Farouk Khalaf Cars",
  instagramName: "@farouk_tbo",
  address: T("الشارقة – معرض رقم 379", "Sharjah – Showroom No. 379"),
  hours: T("يومياً من 9 صباحاً حتى 9 مساءً", "Daily 9 AM – 9 PM"),
  mapQuery: "Sharjah, United Arab Emirates", // غيّره لاسم المكان بالضبط ليظهر على الخريطة
  embedMap: true,                      // true = خريطة جوّا الصفحة
  currency: "$",
  // رابط جدول السيارات من Google Sheets (File → Share → Publish to web → CSV).
  // اتركه فاضي إذا بدك السيارات تنقرأ من js/cars.js بس. الشرح الكامل بملف cars-sheet-howto.txt
  sheetUrl: "",
};

/* ---------------------------- ألوان السيارات ---------------------------- */
const COLORS = {
  white: "#f2f3f5", black: "#17181b", silver: "#b8bcc3", gray: "#7c8087",
  red: "#c8141e", blue: "#2c4f9e", green: "#2f6b4a", brown: "#6b4a35",
  beige: "#cdb89a", gold: "#c8a24a", orange: "#e06d1b", yellow: "#e7c21c",
};
