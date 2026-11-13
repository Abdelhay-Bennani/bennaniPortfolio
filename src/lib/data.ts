import type { Locale } from "@/i18n/config";

export type Localized = Record<Locale, string>;

export type Project = {
  slug: string;
  name: string;
  url: string;
  image: string;
  category: Localized;
  description: Localized;
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "axilum",
    name: "Axilum",
    url: "https://www.axilum91.com/",
    image: "/projects/axilum.png",
    category: { fr: "Événementiel & audiovisuel", en: "Events & audiovisual", ar: "فعاليات وسمعي بصري" },
    description: {
      fr: "Site vitrine pour une société d'événementiel et de prestations audiovisuelles.",
      en: "Showcase website for an events and audiovisual services company.",
      ar: "موقع تعريفي لشركة تنظيم فعاليات وخدمات سمعية بصرية.",
    },
    tags: ["Oktopus CMS", "PHP", "SEO"],
  },
  {
    slug: "pentamill",
    name: "Pentamill",
    url: "https://pentamill.com",
    image: "/projects/pentamill.png",
    category: { fr: "Site business", en: "Business website", ar: "موقع أعمال" },
    description: {
      fr: "Site corporate WordPress avec intégration sur mesure et pages de services.",
      en: "Corporate WordPress website with custom integration and service pages.",
      ar: "موقع شركة بووردبريس مع تكامل مخصص وصفحات خدمات.",
    },
    tags: ["WordPress", "PHP"],
  },
  {
    slug: "violarecipes",
    name: "Viola Recipes",
    url: "https://violarecipes.com",
    image: "/projects/violarecipes.png",
    category: { fr: "Recettes", en: "Recipes", ar: "وصفات" },
    description: {
      fr: "Blog de recettes pensé pour la lecture et l'expérience utilisateur.",
      en: "Recipe blog designed for readability and user experience.",
      ar: "مدونة وصفات مصممة للقراءة وتجربة المستخدم.",
    },
    tags: ["WordPress", "UX"],
  },
  {
    slug: "bestplacesmorocco",
    name: "Best Places Morocco",
    url: "https://bestplacesmorocco.com",
    image: "/projects/bestplacesmorocco.png",
    category: { fr: "Tourisme", en: "Tourism", ar: "سياحة" },
    description: {
      fr: "Guide touristique du Maroc construit avec WordPress et Elementor.",
      en: "Morocco travel guide built with WordPress and Elementor.",
      ar: "دليل سياحي للمغرب مبني بووردبريس و Elementor.",
    },
    tags: ["WordPress", "Elementor"],
  },
  {
    slug: "barji-ma",
    name: "Barji.ma",
    url: "https://barji.ma",
    image: "/projects/barji-ma.png",
    category: { fr: "Site business", en: "Business website", ar: "موقع أعمال" },
    description: {
      fr: "Site vitrine WordPress pour une entreprise marocaine.",
      en: "WordPress showcase website for a Moroccan company.",
      ar: "موقع تعريفي بووردبريس لشركة مغربية.",
    },
    tags: ["WordPress", "PHP"],
  },
  {
    slug: "barji-net",
    name: "Barji.net",
    url: "https://barji.net",
    image: "/projects/barji-net.svg",
    category: { fr: "Site corporate", en: "Corporate website", ar: "موقع شركة" },
    description: {
      fr: "Site corporate WordPress avec thème sur mesure.",
      en: "Corporate WordPress website with a custom theme.",
      ar: "موقع شركة بووردبريس مع قالب مخصص.",
    },
    tags: ["WordPress", "PHP"],
  },
  {
    slug: "agenceduchateau",
    name: "Agence du Château",
    url: "https://agenceduchateau.fr",
    image: "/projects/agenceduchateau.png",
    category: { fr: "Immobilier", en: "Real estate", ar: "عقارات" },
    description: {
      fr: "Site d'agence immobilière sous Oktopus CMS avec annonces et recherche.",
      en: "Real estate agency website on Oktopus CMS with listings and search.",
      ar: "موقع وكالة عقارية على Oktopus CMS مع إعلانات وبحث.",
    },
    tags: ["Oktopus CMS", "PHP"],
  },
  {
    slug: "newgevenements",
    name: "New G Événements",
    url: "https://newgevenements.fr",
    image: "/projects/newgevenements.png",
    category: { fr: "Événementiel", en: "Events", ar: "فعاليات" },
    description: {
      fr: "Site vitrine pour une agence événementielle française.",
      en: "Showcase website for a French events agency.",
      ar: "موقع تعريفي لوكالة فعاليات فرنسية.",
    },
    tags: ["Oktopus CMS", "HTML"],
  },
  {
    slug: "unicentre",
    name: "Unicentre",
    url: "https://unicentre.eu",
    image: "/projects/unicentre.png",
    category: { fr: "Institutionnel", en: "Institutional", ar: "مؤسساتي" },
    description: {
      fr: "Site institutionnel avec intégration CSS soignée sous Oktopus CMS.",
      en: "Institutional website with careful CSS integration on Oktopus CMS.",
      ar: "موقع مؤسساتي مع تكامل CSS متقن على Oktopus CMS.",
    },
    tags: ["Oktopus CMS", "CSS"],
  },
  {
    slug: "adcapt",
    name: "Adcapt",
    url: "https://adcapt.fr",
    image: "/projects/adcapt.png",
    category: { fr: "Site corporate", en: "Corporate website", ar: "موقع شركة" },
    description: {
      fr: "Site corporate sous Oktopus CMS avec développement PHP sur mesure.",
      en: "Corporate website on Oktopus CMS with custom PHP development.",
      ar: "موقع شركة على Oktopus CMS مع تطوير PHP مخصص.",
    },
    tags: ["Oktopus CMS", "PHP"],
  },
  {
    slug: "educateur-canin-montpellier",
    name: "Éducateur Canin Montpellier",
    url: "https://educateur-canin-montpellier.fr",
    image: "/projects/educateur-canin-montpellier.png",
    category: { fr: "Service local", en: "Local service", ar: "خدمة محلية" },
    description: {
      fr: "Site WordPress optimisé pour le SEO local d'un éducateur canin.",
      en: "WordPress website optimised for the local SEO of a dog trainer.",
      ar: "موقع ووردبريس محسّن لـ SEO المحلي لمدرب كلاب.",
    },
    tags: ["WordPress", "SEO local"],
  },
];

export const skills = [
  "WordPress",
  "WooCommerce",
  "PHP",
  "JavaScript (ES6)",
  "HTML5",
  "CSS3",
  "Bootstrap",
  "PrestaShop",
  "Oktopus CMS",
  "MySQL",
  "Figma / PSD",
  "SEO technique",
];

export type Experience = {
  company: string;
  period: Localized;
  role: Localized;
  bullets: Record<Locale, string[]>;
};

export const experiences: Experience[] = [
  {
    company: "Weshore Agency",
    period: { fr: "Avr 2025 — Présent", en: "Apr 2025 — Present", ar: "أبريل 2025 — حتى الآن" },
    role: { fr: "Développeur Web Full Stack", en: "Full Stack Web Developer", ar: "مطور ويب Full Stack" },
    bullets: {
      fr: [
        "Développement et maintenance de sites WordPress et Oktopus CMS.",
        "Maintenance de sites e-commerce sous PrestaShop.",
        "Développement de fonctionnalités sur mesure en PHP, JavaScript, HTML5, CSS3 et MySQL.",
        "Intégration de maquettes Figma/PSD et personnalisation de thèmes, modules et interfaces.",
        "Optimisation des performances, correction de bugs et SEO technique.",
      ],
      en: [
        "Development and maintenance of WordPress and Oktopus CMS websites.",
        "Maintenance of PrestaShop e-commerce websites.",
        "Custom feature development in PHP, JavaScript, HTML5, CSS3 and MySQL.",
        "Figma/PSD integration and customisation of themes, modules and interfaces.",
        "Performance optimisation, bug fixing and technical SEO.",
      ],
      ar: [
        "تطوير وصيانة مواقع ووردبريس و Oktopus CMS.",
        "صيانة مواقع التجارة الإلكترونية على PrestaShop.",
        "تطوير وظائف مخصصة بـ PHP و JavaScript و HTML5 و CSS3 و MySQL.",
        "تكامل تصاميم Figma/PSD وتخصيص القوالب والوحدات والواجهات.",
        "تحسين الأداء، إصلاح الأخطاء و SEO تقني.",
      ],
    },
  },
  {
    company: "Freelance",
    period: { fr: "Avr 2023 — Avr 2025", en: "Apr 2023 — Apr 2025", ar: "أبريل 2023 — أبريل 2025" },
    role: { fr: "Développeur WordPress", en: "WordPress Developer", ar: "مطور ووردبريس" },
    bullets: {
      fr: [
        "Conception de sites WordPress sur mesure pour différents secteurs.",
        "Création de boutiques WooCommerce.",
        "Intégration pixel-perfect de maquettes Figma/PSD.",
        "Développement de thèmes et fonctionnalités personnalisées.",
        "Optimisation SEO, performances et support technique.",
      ],
      en: [
        "Custom WordPress websites for a variety of industries.",
        "WooCommerce store creation.",
        "Pixel-perfect integration of Figma/PSD mockups.",
        "Custom theme and feature development.",
        "SEO, performance optimisation and technical support.",
      ],
      ar: [
        "تصميم مواقع ووردبريس مخصصة لقطاعات مختلفة.",
        "إنشاء متاجر WooCommerce.",
        "تكامل دقيق لتصاميم Figma/PSD.",
        "تطوير قوالب ووظائف مخصصة.",
        "تحسين SEO والأداء والدعم التقني.",
      ],
    },
  },
  {
    company: "INNOVAMACH",
    period: { fr: "Sep 2022 — Mar 2023", en: "Sep 2022 — Mar 2023", ar: "سبتمبر 2022 — مارس 2023" },
    role: { fr: "Développeur Web", en: "Web Developer", ar: "مطور ويب" },
    bullets: {
      fr: [
        "Développement du site web de l'entreprise.",
        "Création de pages vitrines et e-commerce.",
        "Optimisation SEO et mise en place de campagnes marketing digital.",
        "Maintenance et évolution du site.",
      ],
      en: [
        "Development of the company website.",
        "Creation of showcase and e-commerce pages.",
        "SEO optimisation and digital marketing campaigns.",
        "Website maintenance and evolution.",
      ],
      ar: [
        "تطوير الموقع الإلكتروني للشركة.",
        "إنشاء صفحات تعريفية وتجارة إلكترونية.",
        "تحسين SEO وإطلاق حملات تسويق رقمي.",
        "صيانة الموقع وتطويره.",
      ],
    },
  },
  {
    company: "Freelance",
    period: { fr: "Avr 2020 — Août 2022", en: "Apr 2020 — Aug 2022", ar: "أبريل 2020 — أغسطس 2022" },
    role: { fr: "Développeur WordPress", en: "WordPress Developer", ar: "مطور ووردبريس" },
    bullets: {
      fr: [
        "Conception de sites WordPress sur mesure.",
        "Création de boutiques WooCommerce et intégration Figma/PSD.",
        "Développement de thèmes et fonctionnalités personnalisées.",
        "Optimisation SEO, performances et support client.",
      ],
      en: [
        "Custom WordPress website design.",
        "WooCommerce stores and Figma/PSD integration.",
        "Custom theme and feature development.",
        "SEO, performance optimisation and customer support.",
      ],
      ar: [
        "تصميم مواقع ووردبريس مخصصة.",
        "إنشاء متاجر WooCommerce وتكامل Figma/PSD.",
        "تطوير قوالب ووظائف مخصصة.",
        "تحسين SEO والأداء ودعم العملاء.",
      ],
    },
  },
  {
    company: "DEVKIT-SIO",
    period: { fr: "Sep 2019 — Mar 2020", en: "Sep 2019 — Mar 2020", ar: "سبتمبر 2019 — مارس 2020" },
    role: { fr: "Développeur Web WordPress", en: "WordPress Web Developer", ar: "مطور ويب ووردبريس" },
    bullets: {
      fr: [
        "Développement de sites WordPress.",
        "Intégration HTML/CSS à partir de maquettes PSD.",
        "Maintenance, évolution des projets et optimisation de l'expérience utilisateur.",
      ],
      en: [
        "WordPress website development.",
        "HTML/CSS integration from PSD mockups.",
        "Maintenance, project evolution and user experience optimisation.",
      ],
      ar: [
        "تطوير مواقع ووردبريس.",
        "تكامل HTML/CSS من تصاميم PSD.",
        "الصيانة وتطوير المشاريع وتحسين تجربة المستخدم.",
      ],
    },
  },
  {
    company: "Riad Anyssate",
    period: { fr: "2019", en: "2019", ar: "2019" },
    role: { fr: "Développeur .NET · Stage", en: ".NET Developer · Internship", ar: "مطور .NET · تدريب" },
    bullets: {
      fr: [
        "Développement d'une application de gestion des réservations.",
        "Création du site vitrine de l'établissement.",
        "Participation aux phases de tests et de maintenance.",
      ],
      en: [
        "Development of a booking management application.",
        "Creation of the establishment's showcase website.",
        "Participation in testing and maintenance phases.",
      ],
      ar: [
        "تطوير تطبيق لإدارة الحجوزات.",
        "إنشاء الموقع التعريفي للمؤسسة.",
        "المشاركة في مراحل الاختبار والصيانة.",
      ],
    },
  },
];

export type Education = {
  school: string;
  period: string;
  title: Localized;
  detail: Localized;
};

export const education: Education[] = [
  {
    school: "OFPPT - ISTA NTIC SYBA",
    period: "2017 - 2019",
    title: {
      fr: "Technicien spécialisé en développement informatique",
      en: "Specialised technician in software development",
      ar: "تقني متخصص في تطوير البرمجيات",
    },
    detail: { fr: "Diplôme BAC+2.", en: "Two-year higher diploma.", ar: "دبلوم باك+2." },
  },
  {
    school: "Lycée El Jadida Ait Ourir",
    period: "2016",
    title: {
      fr: "BAC Sciences expérimentales",
      en: "Baccalaureate in experimental sciences",
      ar: "بكالوريا علوم تجريبية",
    },
    detail: {
      fr: "Option : Sciences physiques.",
      en: "Option: physical sciences.",
      ar: "مسلك: العلوم الفيزيائية.",
    },
  },
];

export const languages: { name: Localized; level: Localized }[] = [
  { name: { fr: "Arabe", en: "Arabic", ar: "العربية" }, level: { fr: "Courant", en: "Fluent", ar: "لغة أم" } },
  { name: { fr: "Français", en: "French", ar: "الفرنسية" }, level: { fr: "Courant", en: "Fluent", ar: "بطلاقة" } },
  { name: { fr: "Anglais", en: "English", ar: "الإنجليزية" }, level: { fr: "Technique", en: "Technical", ar: "تقني" } },
];

export const stats = [
  { value: "6+", key: "years" },
  { value: "11", key: "projects" },
  { value: "WP", key: "wp" },
  { value: "MA", key: "based" },
] as const;
