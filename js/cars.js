/* =====================================================================
   cars.js — كل السيارات والعروض هون (الملف الوحيد اللي بتعدّل فيه للسيارات)

   ▌ إضافة سيارة بـ 20 ثانية:
       1) انسخ القالب الكامل تحت (برا وجوا بمكان واحد) والصقه آخر القائمة CARS
       2) حط الصور بمجلد img/cars/ بأسماء:  574-1.webp  574-2.webp  574-3.webp ...
          (الرقم = رقم السيارة، وبـ photos اكتب كم صورة)
       3) عدّل القيم — العربي والإنكليزي جنب بعض بنفس السطر
   ▌ لحذف سيارة:    امسح الكتلة تبعها كلها (أو اكتب  hide: true  لإخفائها مؤقتاً).
   ▌ لتغيير السعر:  غيّر price (بالدولار، رقم بدون فاصلة).
   ▌ id: اكتب الرقم بس (574) والموقع بيكمله لـ FK-SHJ-000574 (الرقم الي بيوصل بواتساب).
   ▌ photos: عدد الصور — الموقع بيبني الأسماء لحاله (574-1.webp ... 574-N.webp).
             أو اكتب الأسماء يدوياً:  images: ["camry-1.webp", "camry-2.webp"]
             (أول صورة هي الغلاف. بدون صور الموقع بيرسم سيارة تلقائياً بلونها.)
   ▌ أي حقل ما كتبته بياخد قيمته من CAR_DEFAULTS تحت، فاكتب بس اللي بيختلف.
   ▌ الحقول الثنائية (عربي/إنكليزي):  desc_ar / desc_en ،  brand_ar / model_ar (اسم السيارة بالعربي، اختياري)
                                        location_ar / location_en ،  safety_ar / safety_en ...

   القيم المسموحة:
     body:         sedan | suv | coupe | hatchback | pickup
     color:        white black silver gray red blue green brown beige gold orange yellow
     status:       available (متوفرة) | reserved (محجوزة) | sold (مباعة)
     condition:    new (جديدة) | used (مستعملة)
     sale:         cash (نقدي) | installment (تقسيط) | both (الاثنين)
     fuel:         petrol | diesel | hybrid | electric
     transmission: auto | manual
     drive:        fwd (أمامي) | rwd (خلفي) | awd (رباعي)
     aspiration:   natural | turbo
     installment:  { down: دفعة أولى, monthly: القسط الشهري, months: عدد الأشهر }   (لما sale فيها تقسيط)
   ===================================================================== */

/* ======================= القالب الكامل (انسخه كله وبدّل القيم) =======================
   كل شي عن السيارة بمكان واحد، بنفس الترتيب: برا (البطاقة) ← جوا (النافذة).
   العربي والإنكليزي جنب بعض. اللي ما بدك تغيّره خلّيه متل ما هو أو امسح سطره.

  car({
    // ───────── برا: اللي بيظهر على بطاقة السيارة ─────────
    id: 574,                                    // رقم السيارة (بيصير FK-SHJ-000574)
    brand: "Toyota",      brand_ar: "تويوتا",    // الماركة      إنكليزي | عربي
    model: "Camry",       model_ar: "كامري",     // الموديل      إنكليزي | عربي
    year: 2022,           price: 25000,          // السنة | السعر بالدولار
    condition: "used",    status: "available",   // جديدة new / مستعملة used | متوفرة available / محجوزة reserved / مباعة sold
    sale: "cash",                                // cash نقدي | installment تقسيط | both الاثنين
    // installment: { down: 5000, monthly: 450, months: 48 },   // فعّله إذا sale فيها تقسيط
    color: "silver",      mileage: 30000,        // اللون | الممشى بالكم
    fuel: "petrol",       transmission: "auto",  // بنزين/ديزل/هايبرد/كهرباء | أوتوماتيك/عادي
    photos: 4,                                   // عدد الصور (574-1.webp ... 574-4.webp بمجلد img/cars/)

    // ───────── جوا: اللي بيظهر بنافذة التفاصيل ─────────
    desc_ar: "سيارة بحالة ممتازة، ممشى قليل.",
    desc_en: "Excellent condition with low mileage.",
    location_ar: "الشارقة · معرض رقم 379",   location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي",                     imported_en: "GCC",          // المواصفات: خليجي / أمريكي / ياباني ...
    category_ar: "",                           category_en: "",             // الفئة (مثال: فل أوبشن / Full Option)
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "sedan",                              // sedan | suv | coupe | hatchback | pickup
    drive: "fwd",         aspiration: "natural", // أمامي fwd / خلفي rwd / رباعي awd | natural / turbo
    engineCC: 2500,       cylinders: 4,          // سعة المحرك | عدد الأسطوانات
    doors: 4,             seats: 5,              // الأبواب | المقاعد
    tank: 60,             paintedParts: 0,       // سعة الخزان بالليتر | عدد القطع المصبوغة
    cardYear: 2022,                              // سنة الرخصة (إذا غير السنة)
    negotiable: true,                            // قابل للتفاوض
    plate: "",  chassis: "",  engineNo: "",      // رقم اللوحة | الشاسيه | المحرك (اختياري)
  }),
==================================================================================== */

/* القيم الافتراضية: أي حقل ما كتبته بالسيارة بياخد القيمة من هون */
const CAR_DEFAULTS = {
  status: "available", condition: "used", sale: "cash", negotiable: true,
  fuel: "petrol", transmission: "auto", drive: "fwd", aspiration: "natural",
  doors: 4, seats: 5, cylinders: 4, tank: 60, paintedParts: 0,
  location: T("الشارقة · معرض رقم 379", "Sharjah · Showroom No. 379"),
  imported: T("خليجي", "GCC"),
  category: T("", ""),
  safety: T("نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية", "Anti-lock brakes (ABS), airbags"),
  plate: "", chassis: "", engineNo: "", images: [],
};

/* ---------------- الإعدادات اللي بتبني السيارة لحالها (ما بتحتاج تعدل هون) ---------------- */
const ID_PREFIX = "FK-SHJ-";     // بداية رقم السيارة
const PHOTO_EXT = "webp";        // امتداد الصور اللي بتنبني من photos (غيّره لـ jpg إذا صورك jpg)
const BILINGUAL_FIELDS = ["desc", "location", "imported", "category", "safety"];

// اسم الصورة لحاله (camry-1.webp) بيتحول لمسار كامل بمجلد img/cars/ — أو اكتب رابط كامل http إذا بدك
const carImage = (f) => (/^(https?:|\/|img\/)/.test(f) ? f : ASSETS.carsFolder + f);

const car = (o) => {
  const c = { ...CAR_DEFAULTS, ...o };
  // الرقم: 574 أو "574" ← FK-SHJ-000574
  if (/^\d+$/.test(String(c.id))) { c.numId = String(c.id).replace(/^0+(?=\d)/, ""); c.id = ID_PREFIX + String(c.id).padStart(6, "0"); }
  else c.numId = String(c.id).replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  // الحقول الثنائية: desc_ar + desc_en ← desc: {ar, en}
  BILINGUAL_FIELDS.forEach((k) => {
    const a = o[k + "_ar"], e = o[k + "_en"];
    if (a !== undefined || e !== undefined) c[k] = T(a || e || "", e || a || "");
    delete c[k + "_ar"]; delete c[k + "_en"];
  });
  // الصور: images يدوي، أو photos عدد ← 574-1.webp ... 574-N.webp
  let imgs = (o.images && o.images.length) ? o.images : [];
  if (!imgs.length && o.photos > 0 && c.numId) imgs = Array.from({ length: +o.photos }, (_, i) => `${c.numId}-${i + 1}.${PHOTO_EXT}`);
  c.images = imgs.map(carImage);
  return c;
};

/* ------------------------------ السيارات ------------------------------
   (البيانات هون أمثلة، عدّلها لبضاعتكم الحقيقية)                         */
const CARS_ALL = [
  car({
    // ───────── برا (البطاقة) ─────────
    id: 568,
    brand: "NISSAN PATROL", brand_ar: "",
    model: "2014", model_ar: "",
    year: 2021, price: 27900,
    condition: "used", status: "available",
    sale: "cash",
    color: "red", mileage: 34000,
    fuel: "petrol", transmission: "auto",
    images: ["stock2.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "سيارة بحالة ممتازة، ممشى قليل.",
    desc_en: "Excellent condition with low mileage.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "sedan",
    drive: "rwd", aspiration: "natural",
    engineCC: 1800, cylinders: 4,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
  car({
    // ───────── برا (البطاقة) ─────────
    id: 569,
    brand: "Merceds benz s class", brand_ar: "",
    model: "2007", model_ar: "",
    year: 2023, price: 41200,
    condition: "new", status: "available",
    sale: "cash",
    color: "white", mileage: 8000,
    fuel: "petrol", transmission: "auto",
    images: ["stock3.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "سيارة جديدة كلياً.",
    desc_en: "Brand-new zero-kilometre car.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "suv",
    drive: "awd", aspiration: "natural",
    engineCC: 3000, cylinders: 6,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
  car({
    // ───────── برا (البطاقة) ─────────
    id: 570,
    brand: "huyndai azera", brand_ar: "",
    model: "2018", model_ar: "",
    year: 2020, price: 23900,
    condition: "used", status: "available",
    sale: "cash",
    color: "silver", mileage: 47000,
    fuel: "petrol", transmission: "auto",
    images: ["stock4.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "اقتصادية وعملية.",
    desc_en: "Economical and practical.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "sedan",
    drive: "fwd", aspiration: "natural",
    engineCC: 1600, cylinders: 4,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
  car({
    // ───────── برا (البطاقة) ─────────
    id: 571,
    brand: "Dodge Challenger", brand_ar: "",
    model: "2016", model_ar: "",
    year: 2022, price: 29800,
    condition: "used", status: "available",
    sale: "cash",
    color: "gray", mileage: 26000,
    fuel: "petrol", transmission: "auto",
    images: ["stock5.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "رباعية الدفع عائلية.",
    desc_en: "Family AWD SUV.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "suv",
    drive: "awd", aspiration: "natural",
    engineCC: 2000, cylinders: 4,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
  car({
    // ───────── برا (البطاقة) ─────────
    id: 572,
    brand: "BMW 535 ", brand_ar: "",
    model: "2013", model_ar: "",
    year: 2021, price: 34900,
    condition: "used", status: "available",
    sale: "cash",
    color: "black", mileage: 22000,
    fuel: "petrol", transmission: "auto",
    images: ["stock6.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "فخمة وقوية.",
    desc_en: "Luxurious and powerful.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "sedan",
    drive: "rwd", aspiration: "natural",
    engineCC: 3000, cylinders: 6,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
  car({
    // ───────── برا (البطاقة) ─────────
    id: 573,
    brand: "VOLKSWAGEN GOLF", brand_ar: "",
    model: "2016", model_ar: "",
    year: 2024, price: 38500,
    condition: "new", status: "available",
    sale: "cash",
    color: "white", mileage: 0,
    fuel: "petrol", transmission: "auto",
    images: ["stock7.webp"],

    // ───────── جوا (النافذة) ─────────
    desc_ar: "وصل حديثاً.",
    desc_en: "Just arrived.",
    location_ar: "الشارقة · معرض رقم 379", location_en: "Sharjah · Showroom No. 379",
    imported_ar: "خليجي", imported_en: "GCC",
    category_ar: "", category_en: "",
    safety_ar: "نظام فرامل مانع للانغلاق (ABS)، وسائد هوائية",
    safety_en: "Anti-lock brakes (ABS), airbags",
    body: "suv",
    drive: "awd", aspiration: "natural",
    engineCC: 1800, cylinders: 4,
    doors: 4, seats: 5,
    tank: 60, paintedParts: 0,
    negotiable: true,
    plate: "", chassis: "", engineNo: "",
  }),
];

/* ------------------------------- العروض -------------------------------
   كل عرض مرتبط بسيارة (carId) وسعر العرض (offerPrice).
   لحذف كل العروض خلّي القائمة فاضية:  const OFFERS = [];                  */
const OFFERS = [];

// السيارات الظاهرة بالموقع (اللي عليها hide: true ما بتظهر)
const CARS = CARS_ALL.filter((c) => !c.hide);
