/* =====================================================================
   i18n.js — كل نصوص الموقع بالعربي والإنكليزي. عدّل النص مباشرة.
   ===================================================================== */
const I18N = {
  ar: {
    nav_home: "الرئيسية", nav_shop: "التسوق", nav_offers: "العروض", nav_contact: "تواصل معنا",
    lang_btn: "EN",

    hero_first: "فاروق", hero_last: "خلف",
    hero_sub: "معرض <b class='bn'>فاروق خلف</b> لبيع وشراء السيارات",
 
    hero_cta1: "استكشف أسطولنا",
    scroll: "مرّر",
 
 
 
 
 
 
 
 
 
 
 
 
 cta_wa: "راسلنا عبر واتساب",

    shop_title: "اختر سيارتك", shop_sub: "ابحث بالاسم، أو حدّد السعر والمواصفات بضغطة وحدة، وبتطلع لك السيارات فوراً.",
   
    cur_usd: "دولار $", cur_aed: "درهم AED",
    tab_all: "الكل", tab_cash: "بيع نقدي", tab_install: "تقسيط",
 
 
 
    filters: "التصفية", reset: "مسح التصفية", show_results: "عرض {n} نتيجة", results: "{n} سيارة",
    no_results: "لا توجد سيارات بهذه المواصفات", no_results_sub: "جرّب تعديل خيارات التصفية أو امسحها وابدأ من جديد.",
    sort: "الترتيب", s_new: "الأحدث طرازاً", s_old: "الأقدم طرازاً", s_plow: "السعر: الأقل أولاً", s_phigh: "السعر: الأعلى أولاً", s_kmlow: "الأقل كيلومترات",
 
    fx_search_ph: "اكتب اسم السيارة أو الماركة أو السنة أو الرقم…", fx_digits_hint: "الأرقام بالعربي أو الإنكليزي، كلها مقبولة",
    fx_rate_live: "سعر الصرف المباشر: 1$ = AED {r}", fx_rate: "سعر الصرف: 1$ = AED {r}", fx_under: "حتى {p}", fx_filter: "الفلتر", fx_anyyear: "أي سنة", fx_more: "خيارات إضافية", fx_sale: "طريقة الشراء", fx_yfrom: "من سنة", fx_yto: "إلى سنة",
    f_condition: "الحالة", f_all: "الكل", f_brand: "النوع (الماركة)", 
    f_body: "نوع الهيكل", f_price: "السعر", f_min: "من", f_max: "إلى", f_year: "سنة الصنع",
    f_km: "الكيلومترات", f_any: "أي مسافة", f_up_to: "حتى {n} كم",
    f_fuel: "نوع الوقود", f_trans: "ناقل الحركة", f_drive: "نظام الدفع", f_color: "اللون",
 f_avail_only: "المتاحة فقط", f_saved: "المحفوظة",
    load_more: "عرض المزيد", 
    view_details: "عرض جميع التفاصيل", km: "كم", liter: "لتر",

    m_specs: "مواصفات السيارة", m_id: "المعرف", m_model: "الطراز", m_desc: "الوصف",
    m_order_cash: "اطلب السيارة عبر واتساب", m_order_cash_only: "اطلب نقداً", m_order_inst: "اطلب بالتقسيط",
    m_copy: "نسخ المعرف", m_negotiable: "قابل للتفاوض",
    m_plan: "خطة التقسيط", m_down: "الدفعة الأولى", m_monthly: "القسط الشهري", m_months: "عدد الأشهر", month_unit: "شهر",
    m_from: "تقسيط من", per_month: "/ شهرياً", m_unavailable: "هذه السيارة غير متاحة حالياً", m_ask: "استفسر عن سيارات مشابهة",
    close: "إغلاق", save: "حفظ",

    sp_location: "تواجد السيارة:", sp_trans: "ناقل الحركة:", sp_year: "السنة:", sp_card: "سنة التسجيل:",
    sp_cyl: "سلندر:", sp_cc: "سعة المحرك:", sp_status: "حالة السيارة:", sp_seats: "المقاعد:", sp_doors: "الأبواب:",
    sp_aspiration: "نظام سحب الهواء:", sp_drive: "نظام الدفع:", sp_tank: "سعة الخزان:", sp_painted: "القطع المُعاد طلاؤها:",
    sp_safety: "السلامة:", sp_color: "اللون:", sp_fuel: "نوع الوقود:", sp_km: "الكيلومتراج:", sp_cond: "الحالة:",
    sp_import: "الوارد:", sp_nego: "قابل للتفاوض:", sp_category: "الفئة:", sp_plate: "رقم اللوحة:",
    sp_chassis: "رقم الهيكل:", sp_engine: "رقم المحرك:",
    cyl_unit: "{n} سلندر", piece_n: "{n} قطعة", no_paint: "بدون إعادة طلاء", yes: "نعم", no: "لا",

    v_auto: "أوتوماتيك", v_manual: "يدوي",
    v_petrol: "بنزين", v_diesel: "ديزل", v_hybrid: "هايبرد", v_electric: "كهرباء",
    v_new: "جديدة", v_used: "مستعملة",
    v_available: "متاحة", v_reserved: "محجوزة", v_sold: "مباعة",
    v_awd: "دفع رباعي", v_fwd: "دفع أمامي", v_rwd: "دفع خلفي",
    v_natural: "تنفس طبيعي", v_turbo: "تيربو",
    b_sedan: "سيدان", b_suv: "SUV", b_coupe: "كوبيه", b_hatchback: "هاتشباك", b_pickup: "بيك أب",
    c_white: "أبيض", c_black: "أسود", c_silver: "فضي", c_gray: "رمادي", c_red: "أحمر", c_blue: "أزرق",
    c_green: "أخضر", c_brown: "بني", c_beige: "بيج", c_gold: "ذهبي", c_orange: "برتقالي", c_yellow: "أصفر",

    wa_hello: "مرحباً، أرغب بطلب السيارة التالية:", wa_name: "الاسم", wa_id: "المعرف", wa_type: "النوع",
    wa_brand: "الماركة", wa_year: "الطراز", wa_price: "السعر", wa_mode: "طريقة الشراء",
    wa_cash: "نقداً", wa_inst: "تقسيط", wa_offer: "العرض",
    wa_general: "مرحباً، أرغب بالاستفسار عن سياراتكم.",

    offers_title: "العروض", offers_sub: "عروض حصرية على سيارات مختارة لفترة محدودة.",
    offers_empty: "عروض جديدة قريباً", offers_empty_sub: "تابعنا على فيسبوك وإنستغرام لتصلك العروض أولاً بأول.",
    offer_until: "ينتهي العرض في", offer_order: "اطلب العرض", offer_details: "التفاصيل", offer_was: "بدل",

    contact_title: "تواصل معنا", contact_sub: "فريقنا جاهز للرد على استفساراتكم وترتيب زيارة المعرض.",
    c_whatsapp: "واتساب", c_facebook: "فيسبوك", c_instagram: "إنستغرام", c_phone: "اتصال هاتفي",
    c_open: "فتح", c_chat: "ابدأ محادثة", c_follow: "تابعنا", c_call: "اتصل بنا",
    c_address: "عنوان المعرض", c_hours: "ساعات العمل", c_map: "موقعنا على الخريطة", c_open_map: "افتح في خرائط جوجل",
    c_visit: "زورونا",

    ft_about: "معرض <b class='bn'>فاروق خلف</b> لبيع وشراء السيارات: أفضل سعر، ثقة وشفافية، فحص شامل وجودة مضمونة.",
    ft_links: "روابط سريعة", ft_contact: "معلومات التواصل",
    ft_rights: "© {y} معرض <b class='bn'>فاروق خلف</b> لبيع وشراء السيارات. جميع الحقوق محفوظة.",
    ft_privacy: "سياسة الخصوصية", ft_terms: "الشروط والأحكام",

    privacy_title: "سياسة الخصوصية",
    privacy_body: [
      "نحترم خصوصيتك. هذا الموقع لا يطلب منك إنشاء حساب ولا يجمع بياناتك الشخصية على خوادمنا.",
      "عند الضغط على زر طلب سيارة يتم فتح محادثة واتساب معنا تحتوي على بيانات السيارة التي اخترتها فقط. أي معلومات تشاركها معنا في المحادثة نستخدمها فقط للرد على طلبك.",
      "يحفظ المتصفح لديك تفضيلاتك (اللغة والسيارات المحفوظة) على جهازك فقط، ويمكنك مسحها في أي وقت من إعدادات المتصفح.",
      "لا نشارك بياناتك مع أي جهة خارجية إلا إذا كان ذلك مطلوباً قانونياً.",
      "للاستفسار عن خصوصيتك تواصل معنا عبر واتساب.",
    ],
    terms_title: "الشروط والأحكام",
    terms_body: [
      "المعلومات والأسعار والصور المعروضة في الموقع قابلة للتغيير دون إشعار مسبق، والسعر المعتمد هو السعر المؤكد من المعرض عند إتمام الصفقة.",
      "تعرض الصور بغرض التوضيح وقد تختلف عن السيارة الفعلية؛ ننصح بمعاينة السيارة وفحصها قبل الشراء.",
      "توفر السيارة يتم تأكيده من المعرض، ويُعتبر طلب السيارة عبر الموقع استفساراً وليس عقد بيع.",
      "شروط التقسيط (الدفعة الأولى، القسط، المدة) تخضع لموافقة المعرض وجهة التمويل وقد تتغير حسب الحالة.",
      "إتمام البيع يتطلب توقيع عقد رسمي وتقديم الأوراق المطلوبة وفق القوانين المعمول بها في دولة الإمارات.",
    ],
  },

  en: {
    nav_home: "Home", nav_shop: "Shop", nav_offers: "Offers", nav_contact: "Contact",
    lang_btn: "AR",

    hero_first: "FAROUK", hero_last: "KHALAF",
    hero_sub: "<b class='bn'>Farouk Khalaf</b> Cars Buying & Selling Showroom",
 
    hero_cta1: "Explore Our Fleet",
    scroll: "Scroll",
 
 
 
 
 
 
 
 
 
 
 
 
 cta_wa: "Message us on WhatsApp",

    shop_title: "Find Your Car", shop_sub: "Search by name, or set price and specs in one tap, and cars show up instantly.",
   
    cur_usd: "USD $", cur_aed: "AED",
    tab_all: "All", tab_cash: "Cash Sale", tab_install: "Installment",
 
 
 
    filters: "Filters", reset: "Clear filters", show_results: "Show {n} results", results: "{n} cars",
    no_results: "No cars match these filters", no_results_sub: "Try changing or clearing the filters.",
    sort: "Sort", s_new: "Newest model", s_old: "Oldest model", s_plow: "Price: low to high", s_phigh: "Price: high to low", s_kmlow: "Lowest mileage",
 
    fx_search_ph: "Type a car name, brand, year or ID…", fx_digits_hint: "Arabic or English digits both work",
    fx_rate_live: "Live exchange rate: $1 = AED {r}", fx_rate: "Exchange rate: $1 = AED {r}", fx_under: "Up to {p}", fx_filter: "Filter", fx_anyyear: "Any year", fx_more: "More options", fx_sale: "Purchase type", fx_yfrom: "From year", fx_yto: "To year",
    f_condition: "Condition", f_all: "All", f_brand: "Brand", 
    f_body: "Body type", f_price: "Price", f_min: "Min", f_max: "Max", f_year: "Model year",
    f_km: "Mileage", f_any: "Any mileage", f_up_to: "Up to {n} km",
    f_fuel: "Fuel type", f_trans: "Transmission", f_drive: "Drivetrain", f_color: "Color",
 f_avail_only: "Available only", f_saved: "Saved",
    load_more: "Show more", 
    view_details: "View full details", km: "km", liter: "L",

    m_specs: "Vehicle Specifications", m_id: "ID", m_model: "Model", m_desc: "Description",
    m_order_cash: "Order via WhatsApp", m_order_cash_only: "Order (cash)", m_order_inst: "Order on installments",
    m_copy: "Copy ID", m_negotiable: "Negotiable",
    m_plan: "Installment plan", m_down: "Down payment", m_monthly: "Monthly payment", m_months: "Duration", month_unit: "months",
    m_from: "Installments from", per_month: "/ month", m_unavailable: "This car is not available right now", m_ask: "Ask about similar cars",
    close: "Close", save: "Save",

    sp_location: "Location:", sp_trans: "Transmission:", sp_year: "Year:", sp_card: "Registration year:",
    sp_cyl: "Cylinders:", sp_cc: "Engine size:", sp_status: "Status:", sp_seats: "Seats:", sp_doors: "Doors:",
    sp_aspiration: "Aspiration:", sp_drive: "Drivetrain:", sp_tank: "Tank capacity:", sp_painted: "Repainted parts:",
    sp_safety: "Safety:", sp_color: "Color:", sp_fuel: "Fuel type:", sp_km: "Mileage:", sp_cond: "Condition:",
    sp_import: "Import:", sp_nego: "Negotiable:", sp_category: "Trim:", sp_plate: "Plate number:",
    sp_chassis: "Chassis number:", sp_engine: "Engine number:",
    cyl_unit: "{n} cylinders", piece_n: "{n} pieces", no_paint: "No repaint", yes: "Yes", no: "No",

    v_auto: "Automatic", v_manual: "Manual",
    v_petrol: "Petrol", v_diesel: "Diesel", v_hybrid: "Hybrid", v_electric: "Electric",
    v_new: "New", v_used: "Used",
    v_available: "Available", v_reserved: "Reserved", v_sold: "Sold",
    v_awd: "All-wheel drive", v_fwd: "Front-wheel drive", v_rwd: "Rear-wheel drive",
    v_natural: "Naturally aspirated", v_turbo: "Turbocharged",
    b_sedan: "Sedan", b_suv: "SUV", b_coupe: "Coupe", b_hatchback: "Hatchback", b_pickup: "Pickup",
    c_white: "White", c_black: "Black", c_silver: "Silver", c_gray: "Gray", c_red: "Red", c_blue: "Blue",
    c_green: "Green", c_brown: "Brown", c_beige: "Beige", c_gold: "Gold", c_orange: "Orange", c_yellow: "Yellow",

    wa_hello: "Hello, I would like to order the following car:", wa_name: "Name", wa_id: "ID", wa_type: "Type",
    wa_brand: "Brand", wa_year: "Model year", wa_price: "Price", wa_mode: "Payment",
    wa_cash: "Cash", wa_inst: "Installments", wa_offer: "Offer",
    wa_general: "Hello, I would like to ask about your cars.",

    offers_title: "Offers", offers_sub: "Exclusive limited-time deals on selected cars.",
    offers_empty: "New offers coming soon", offers_empty_sub: "Follow us on Facebook and Instagram to get offers first.",
    offer_until: "Offer ends", offer_order: "Order this offer", offer_details: "Details", offer_was: "was",

    contact_title: "Contact Us", contact_sub: "Our team is ready to answer your questions and arrange a showroom visit.",
    c_whatsapp: "WhatsApp", c_facebook: "Facebook", c_instagram: "Instagram", c_phone: "Phone",
    c_open: "Open", c_chat: "Start a chat", c_follow: "Follow us", c_call: "Call us",
    c_address: "Showroom address", c_hours: "Opening hours", c_map: "Find us on the map", c_open_map: "Open in Google Maps",
    c_visit: "Visit us",

    ft_about: "<b class='bn'>Farouk Khalaf</b> Cars Showroom: best price, trust and transparency, full inspection and guaranteed quality.",
    ft_links: "Quick links", ft_contact: "Contact",
    ft_rights: "© {y} <b class='bn'>Farouk Khalaf</b> Cars Buying & Selling Showroom. All rights reserved.",
    ft_privacy: "Privacy Policy", ft_terms: "Terms & Conditions",

    privacy_title: "Privacy Policy",
    privacy_body: [
      "We respect your privacy. This website does not ask you to create an account and does not collect your personal data on our servers.",
      "When you press an order button, a WhatsApp chat opens with the details of the car you chose only. Anything you share in that chat is used only to answer your request.",
      "Your browser stores your preferences (language and saved cars) on your own device only. You can clear them at any time from your browser settings.",
      "We do not share your data with third parties unless required by law.",
      "For any privacy question, contact us on WhatsApp.",
    ],
    terms_title: "Terms & Conditions",
    terms_body: [
      "Information, prices and photos on this website may change without notice. The final price is the one confirmed by the showroom when the deal is completed.",
      "Photos are for illustration and may differ from the actual car. We recommend inspecting the car before buying.",
      "Availability is confirmed by the showroom. Ordering a car through the website is an enquiry, not a sales contract.",
      "Installment terms (down payment, monthly payment, duration) are subject to approval by the showroom and the financing party and may vary by case.",
      "Completing a sale requires a signed contract and the required documents under the laws in force in the United Arab Emirates.",
    ],
  },
};
