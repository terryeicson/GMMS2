export interface TranslationStrings {
  republicOfRwanda: string;
  portalTitle: string;
  portalSubtitle: string;
  navHome: string;
  navTenders: string;
  navMyApps: string;
  navVendorProfile: string;
  navBackendCode: string;
  signIn: string;
  register: string;
  exploreMarkets: string;
  createAccountCta: string;
  loginToAccountCta: string;
  logout: string;
  allSectors: string;
  allDistricts: string;
  roadConstruction: string;
  schoolFeeding: string;
  schoolUniforms: string;
  marketStalls: string;
  estimatedBudget: string;
  monthlyTariff: string;
  deadline: string;
  procuringEntity: string;
  applyNow: string;
  viewDetails: string;
  filterSearchPlaceholder: string;
  preAppWarningTitle: string;
  preAppWarningDesc: string;
  completeProfileCta: string;
  vendorProfileModalTitle: string;
  vendorProfileSubtitle: string;
  businessType: string;
  individualTrader: string;
  individualDesc: string;
  registeredCompany: string;
  companyDesc: string;
  companyName: string;
  rdbNumber: string;
  tinNumber: string;
  tinHint: string;
  category: string;
  experienceYears: string;
  district: string;
  province: string;
  servicesDescription: string;
  taxClearanceDeclaration: string;
  rssbDeclaration: string;
  saveProfile: string;
  bidFormTitle: string;
  bidOfferLabel: string;
  deliveryDaysLabel: string;
  technicalSummaryLabel: string;
  antiCorruptionPledgeTitle: string;
  antiCorruptionPledgeText: string;
  submitBidCta: string;
  trackingCode: string;
  submissionDate: string;
  submissionReceiptTitle: string;
  printReceipt: string;
  close: string;
  statusSubmitted: string;
  statusAdminReview: string;
  statusTechnical: string;
  statusFinancial: string;
  statusAwarded: string;
  statusRejected: string;
}

export const translations: Record<'en' | 'rw', TranslationStrings> = {
  en: {
    republicOfRwanda: "Republic of Rwanda",
    portalTitle: "GMMS Rwanda — E-Procurement & Market Portal",
    portalSubtitle: "Official Government Market and Tender System for Infrastructure, School Supplies & Municipal Stalls",
    navHome: "Home",
    navTenders: "Markets & Tenders",
    navMyApps: "My Applications",
    navVendorProfile: "Vendor Profile",
    navBackendCode: "PHP / MySQL Source",
    signIn: "Sign In",
    register: "Register",
    exploreMarkets: "Explore All Markets",
    createAccountCta: "Create Vendor Account",
    loginToAccountCta: "Sign In to Portal",
    logout: "Log Out",
    allSectors: "All Sectors",
    allDistricts: "All Districts",
    roadConstruction: "Road Construction & Works",
    schoolFeeding: "School Feeding Supplies",
    schoolUniforms: "School Uniforms & Textiles",
    marketStalls: "Market Stall Allocations",
    estimatedBudget: "Estimated Budget",
    monthlyTariff: "Monthly Stall Tariff",
    deadline: "Deadline",
    procuringEntity: "Procuring Entity",
    applyNow: "Apply for Tender",
    viewDetails: "View Specifications",
    filterSearchPlaceholder: "Search tender title, reference, or district...",
    preAppWarningTitle: "Mandatory Pre-Application Vendor Profile Required",
    preAppWarningDesc: "Under RPPA Procurement Regulations, every applicant must complete their Vendor Profile (TIN, business classification, and experience) before submitting any bid.",
    completeProfileCta: "Complete Vendor Profile Now",
    vendorProfileModalTitle: "Pre-Application Vendor Profile",
    vendorProfileSubtitle: "Official Business Classification & Tax Verification",
    businessType: "Business Entity Type",
    individualTrader: "Individual Trader / Small Hawker",
    individualDesc: "Single person or stall vendor (TIN is optional)",
    registeredCompany: "Registered Company (Ltd/Inc)",
    companyDesc: "Entity registered with RDB (9-Digit TIN mandatory)",
    companyName: "Company Legal Name",
    rdbNumber: "RDB Registration Number (Optional)",
    tinNumber: "Tax Identification Number (TIN)",
    tinHint: "Mandatory 9-digit RRA tax identifier for registered companies.",
    category: "Primary Business Category",
    experienceYears: "Years of Experience in this Field",
    district: "District of Operation",
    province: "Province",
    servicesDescription: "Description of Products & Services",
    taxClearanceDeclaration: "Possess a valid Rwanda Revenue Authority (RRA) Tax Clearance Certificate",
    rssbDeclaration: "Compliant with Rwanda Social Security Board (RSSB) obligations if employing staff",
    saveProfile: "Save Official Vendor Profile",
    bidFormTitle: "Tender Application & Financial Bid",
    bidOfferLabel: "Financial Offer / Bid Price (RWF)",
    deliveryDaysLabel: "Proposed Completion / Delivery Timeline (Days)",
    technicalSummaryLabel: "Technical Proposal & Operational Capacity",
    antiCorruptionPledgeTitle: "Republic of Rwanda Public Procurement Integrity Pledge",
    antiCorruptionPledgeText: "I solemnly declare under Rwandan law that all statements and certificates submitted are genuine, and no corrupt practice or bribery was involved.",
    submitBidCta: "Submit Official Bid Application",
    trackingCode: "Tracking Reference Code",
    submissionDate: "Date of Submission",
    submissionReceiptTitle: "Official Application Receipt / Certificat de Dépôt",
    printReceipt: "Print Official Certificate",
    close: "Close",
    statusSubmitted: "Submission Received",
    statusAdminReview: "Administrative Screening",
    statusTechnical: "Technical Evaluation",
    statusFinancial: "Financial Opening",
    statusAwarded: "Contract Awarded",
    statusRejected: "Unsuccessful",
  },
  rw: {
    republicOfRwanda: "Repubulika y'u Rwanda",
    portalTitle: "GMMS Rwanda — Urwego rwo Gutanga Amasoko ya Leta",
    portalSubtitle: "Sisitemu yemewe ya Leta yo gupiganira amasoko y'imihanda, ibiribwa, impuzankano n'ibibanza mu masoko",
    navHome: "Ahabanza",
    navTenders: "Amasoko yose",
    navMyApps: "Amasoko Nasabye",
    navVendorProfile: "Umwirondoro w'Ubucuruzi",
    navBackendCode: "Kode za PHP / MySQL",
    signIn: "Kwinjira",
    register: "Kwiyandikisha",
    exploreMarkets: "Reba Amasoko Yose",
    createAccountCta: "Kwiyandikisha Nk'Umupiganwa",
    loginToAccountCta: "Kwinjira muri Sisitemu",
    logout: "Gusohoka",
    allSectors: "Amatsinda Yose",
    allDistricts: "Uturere Twose",
    roadConstruction: "Ubwubatsi bw'Imihanda",
    schoolFeeding: "Kugaburira Abanyeshuri (Ibiribwa)",
    schoolUniforms: "Kudoda Impuzankano z'Amashuri",
    marketStalls: "Ibibanza mu Masoko Rusange",
    estimatedBudget: "Agaciro k'Isoko",
    monthlyTariff: "Ubukode bw'Ikibanza ku Kwezi",
    deadline: "Itariki Ntarengwa",
    procuringEntity: "Urwego Rutanga Isoko",
    applyNow: "Gusaba Isoko",
    viewDetails: "Kureba Ibisabwa",
    filterSearchPlaceholder: "Shakisha izina ry'isoko, nimero, cyangwa akarere...",
    preAppWarningTitle: "Ibisabwa Mbere yo Gusaba Isoko: Wuzuze Umwirondoro w'Ubucuruzi",
    preAppWarningDesc: "Dukurikije amategeko agenga amasoko ya Leta mu Rwanda (RPPA), buri mupiganwa agomba kubanza kuzuza Umwirondoro w'Ubucuruzi (TIN, icyiciro, n'uburambe) mbere yo gusaba isoko iryo ariryo ryose.",
    completeProfileCta: "Uzuza Umwirondoro w'Ubucuruzi Ubu",
    vendorProfileModalTitle: "Umwirondoro w'Ubucuruzi w'Umusaba Isoko",
    vendorProfileSubtitle: "Kwandikisha ubucuruzi no kugenzura imisoro yemewe",
    businessType: "Ubwoko bw'Ubucuruzi",
    individualTrader: "Umucuruzi ku Giti cye / Umuzunguzayi",
    individualDesc: "Umuntu ku giti cye cyangwa umucuruzi wo mu isoko (TIN ni amahitamo)",
    registeredCompany: "Sosiyete Yanditse mu RDB (Ltd)",
    companyDesc: "Ikigo cyanditse mu bucuruzi (TIN y'imibare 9 irakenewe ku gahato)",
    companyName: "Izina Ryemewe rya Sosiyete",
    rdbNumber: "Nimero y'Ubwanditsi muri RDB (Niba ihari)",
    tinNumber: "Nimero y'Ibarura ry'Umusoro (TIN)",
    tinHint: "Nimero y'imibare 9 itangwa na RRA (Rwanda Revenue Authority).",
    category: "Icyiciro cy'Ubucuruzi Ukoramo",
    experienceYears: "Imyaka y'Uburambe muri uyu Murimo",
    district: "Akarere Ukoreramo",
    province: "Intara",
    servicesDescription: "Ibisobanuro by'Ibicuruzwa na Serivisi Utanga",
    taxClearanceDeclaration: "Mfitanye icyemezo cy'uko nta misoro ndimo nambaye Rwanda Revenue Authority (RRA)",
    rssbDeclaration: "Nubahiriza inshingano zo gutangira abakozi ubwisungane bw'izabukuru muri RSSB",
    saveProfile: "Bika Umwirondoro w'Ubucuruzi",
    bidFormTitle: "Gusaba Isoko no Gutanga Igiciro cy'Ipiganwa",
    bidOfferLabel: "Igiciro Wifuza ku Isoko (Muri RWF)",
    deliveryDaysLabel: "Iminsi Ikenewe yo Kurangiza Isoko (Iminsi y'Ikirenga)",
    technicalSummaryLabel: "Uburyo bwa Tekiniki no Kwerekana Ubushobozi Bwo Gusohoza Isoko",
    antiCorruptionPledgeTitle: "Igihango cyo Kurwanya Ruswa mu Masoko ya Leta y'u Rwanda",
    antiCorruptionPledgeText: "Ndemeye ku mugaragaro nk'uko amategeko y'u Rwanda abiteganya ko ibyangombwa byose natanze ari ukuri kandi ko ntamahirwe ya ruswa cyangwa ubucakura bwigeze bubaho.",
    submitBidCta: "Ohereza Icyifuzo Cyemewe cy'Ipiganwa",
    trackingCode: "Nimero Irambuye y'Idosiye (Tracking Code)",
    submissionDate: "Itariki n'Isaha Byakiririweho",
    submissionReceiptTitle: "Icyemezo Cyemeza Kwakira Idosiye y'Isoko",
    printReceipt: "Gucapa Icyemezo (Print Receipt)",
    close: "Funga",
    statusSubmitted: "Icyifuzo Cyakiriwe",
    statusAdminReview: "Isuzuma ry'Ibyangombwa",
    statusTechnical: "Isuzuma rya Tekiniki",
    statusFinancial: "Gufungura Ibiciro",
    statusAwarded: "Isoko Ryatanzwe",
    statusRejected: "Ntiyatsindiye Isoko",
  }
};
