import { Tender } from '../types';

export const initialTenders: Tender[] = [
  {
    id: 1,
    tender_reference: 'TND/2026/COK/RDS/041',
    title_en: 'Rehabilitation, Asphalt Paving and Drainage of Nyarugenge-Nyamirambo Feeder Roads (6.8 km)',
    title_rw: 'Kuvugurura, gushyiramo kaburimbo n\'imiyoboro y\'amazi ku mihanda ya Nyarugenge-Nyamirambo (km 6.8)',
    procuring_entity_en: 'City of Kigali - Directorate of Infrastructure & Urban Mobility',
    procuring_entity_rw: 'Umujyi wa Kigali - Ishami ry\'Ibikorwaremezo n\'Ubwikorezi',
    category: 'road_construction',
    location_district: 'Nyarugenge',
    location_province: 'Kigali City',
    estimated_budget_rwf: 1450000000,
    bid_security_rwf: 29000000,
    description_en: 'The City of Kigali invites eligible Class-A & Class-B civil engineering contractors to submit competitive bids for full-depth asphalt paving, reinforced concrete drain construction, stone curbs, pedestrian walkways, and solar street-lighting along 3 strategic feeder corridors connecting Nyarugenge and Nyamirambo sectors.',
    description_rw: 'Umujyi wa Kigali uratumiye ibigo by\'ubwubatsi byemewe by\'iciro rya A na B gupiganira isoko ryo gusana, gushyiramo kaburimbo, kubaka imiyoboro y\'amazi ikomeye, inzira z\'abanyamaguru n\'amatara y\'imirasire y\'izuba ku mihanda y\'imigenderano ihuza imirenge ya Nyarugenge na Nyamirambo.',
    requirements_en: [
      'Valid RDB Certificate of Registration (Civil Engineering / Works category)',
      'Valid RRA Tax Clearance Certificate (issued within last 30 days)',
      'Valid RSSB Social Security Contribution Compliance Certificate',
      'Bank Guarantee / Bid Security of 29,000,000 RWF from a licensed commercial bank',
      'Proof of at least 2 successfully executed asphalt road contracts valued at > 800M RWF within past 5 years',
      'List of owned or leased heavy equipment (Asphalt paver, pneumatic compactors, excavators, dump trucks)'
    ],
    requirements_rw: [
      'Icyemezo cy\'ubwanditsi muri RDB mu cyiciro cy\'ubwubatsi',
      'Icyemezo cyo kutabamo imyenda y\'imisoro muri RRA cyatanzwe mu minsi 30 ishize',
      'Icyemezo cyo kutabamo umwenda w\'ubwisungane bw\'abakozi muri RSSB',
      'Ingarama y\'ipiganwa (Bid Security) ingana na 29,000,000 RWF itanzwe na banki yemewe mu Rwanda',
      'Ibyemezo by\'imirimo yo kubaka imihanda 2 ya kaburimbo yarengeje miliyoni 800 RWF mu myaka 5 ishize',
      'Urutonde rw\'imashini n\'ibinyabiziga (paver, compactor, tingatinga, amakamyo)'
    ],
    published_at: '2026-10-15',
    submission_deadline: '2026-11-18 10:00 AM',
    status: 'open'
  },
  {
    id: 2,
    tender_reference: 'TND/2026/MINEDUC/SF/019',
    title_en: 'Bulk Supply of Grade-1 Fortified Maize Flour, Dry Red Beans and Rice to 32 Public Secondary Schools',
    title_rw: 'Gutanga ibiribwa bikungahaye ku ntungamubiri (Kawunga, Ibihyimbo by\'umutuku n\'Umuceri) mu mashuri 32 ya Leta muri Bugesera',
    procuring_entity_en: 'Ministry of Education & Bugesera District Joint School Feeding Board',
    procuring_entity_rw: 'Minisiteri y\'Uburezi n\'Akarere ka Bugesera - Komite yo Kugaburira Abanyeshuri',
    category: 'school_feeding',
    location_district: 'Bugesera',
    location_province: 'Eastern Province',
    estimated_budget_rwf: 280000000,
    bid_security_rwf: 5600000,
    description_en: 'Tender for the procurement, quality testing, and scheduled monthly delivery of 120 metric tons of iron/vitamin-fortified maize flour, 65 metric tons of clean graded dry beans, and 45 metric tons of locally milled rice across 32 secondary boarding and day schools in Bugesera District during the upcoming academic terms.',
    description_rw: 'Isoko ryo kugura, gupima ubuziranenge, no kugeza mu mashuri toni 120 za kawunga yongewemo intungamubiri z\'ubutare, toni 65 z\'ibihyimbo byatoranijwe, na toni 45 z\'umuceri utunganirijwe mu Rwanda mu mashuri yisumbuye 32 mu Karere ka Bugesera.',
    requirements_en: [
      'Registered Vendor Profile in GMMS with valid TIN number',
      'Rwanda FDA / RSB (Rwanda Standards Board) food handling and packaging compliance certificate',
      'Proof of hygienic storage warehouse with pest-control certificate',
      'Valid RRA Tax Clearance Certificate',
      'Verifiable supply agreements or proof of previous bulk food grain deliveries'
    ],
    requirements_rw: [
      'Kuba ufite Umwirondoro w\'Ubucuruzi wuzuye muri GMMS ufite TIN',
      'Icyemezo cy\'ubuziranenge cyatanzwe na Rwanda FDA cyangwa RSB cyo kubika no gupfunyika ibiribwa',
      'Icyemezo cy\'ububiko bwisukuye budatuye udukoko',
      'Icyemezo cyo kwishyura imisoro (RRA Tax Clearance)',
      'Ibyemezo by\'amasezerano yo kugemura ibiribwa byashize'
    ],
    published_at: '2026-10-18',
    submission_deadline: '2026-11-10 14:00 PM',
    status: 'open'
  },
  {
    id: 3,
    tender_reference: 'TND/2026/HUYE/TXT/008',
    title_en: 'Bulk Manufacturing, Sizing and Supply of Standardized School Uniforms & PE Sportswear (14,200 Sets)',
    title_rw: 'Kudoda, gupima ingano no gutanga impuzankano z\'amashuri n\'imyenda ya Siporo (Iseti 14,200) mu Karere ka Huye',
    procuring_entity_en: 'Southern Province - Huye District Education Directorate',
    procuring_entity_rw: 'Intara y\'Amajyepfo - Ubuyobozi bw\'Uburezi mu Karere ka Huye',
    category: 'school_uniforms',
    location_district: 'Huye',
    location_province: 'Southern Province',
    estimated_budget_rwf: 115000000,
    bid_security_rwf: 2300000,
    description_en: 'Huye District seeks certified garment manufacturers, local tailoring cooperatives, and textile suppliers to manufacture, pack, and distribute 14,200 durable school uniform sets (comprising poplin shirts, trousers/pleated skirts, and embroidered acrylic V-neck sweaters) in strict adherence to MINEDUC national educational fabric standards.',
    description_rw: 'Akarere ka Huye karashaka amakoperative y\'abadozi, inganda z\'imyenda, n\'abacuruzi b\'imyenda bo kudoda no gukwirakwiza iseti 14,200 z\'impuzankano (amashati, amakabutura/amajipo, n\'imipira y\'imbeho) zujuje amabwiriza ya Made-in-Rwanda agenga amashuri.',
    requirements_en: [
      'RDB Registration Certificate in Tailoring / Textile Manufacturing or RCA Certificate for Cooperatives',
      'Submission of physical prototype sample conforming to Huye District specified color schemes and density',
      'Demonstrated workshop production capacity of at least 1,200 uniform sets per week',
      'Valid RRA Tax Clearance Certificate'
    ],
    requirements_rw: [
      'Icyemezo cya RDB mu kudoda / ubudozi cyangwa icyemezo cya RCA ku makoperative',
      'Kuzana icyitegererezo cy\'umwenda gikozwe mu mwenda wujuje ibisabwa n\'amabara y\'amashuri',
      'Kugaragaza ubushobozi bw\'amashini n\'abadozi bashobora gukora byibuze iseti 1,200 mu cyumweru',
      'Icyemezo cyo kutabamo imyenda y\'imisoro muri RRA'
    ],
    published_at: '2026-10-12',
    submission_deadline: '2026-11-14 11:30 AM',
    status: 'open'
  },
  {
    id: 4,
    tender_reference: 'TND/2026/GASABO/MKT/012',
    title_en: 'Allocation and 3-Year Renewable Lease of Modern Retail & Produce Stalls at Kimironko & Nyabugogo Markets',
    title_rw: 'Gukodesha no gutanga ibibanza by\'ubucuruzi buciriritse n\'imboga mu Isoko rya Kimironko n\'Irya Nyabugogo (Block C & D - Ibibanza 64)',
    procuring_entity_en: 'City of Kigali - Gasabo & Nyarugenge Joint Municipal Market Authority',
    procuring_entity_rw: 'Umujyi wa Kigali - Ubuyobozi bw\'Amasoko Rusange ya Gasabo na Nyarugenge',
    category: 'market_stalls',
    location_district: 'Gasabo',
    location_province: 'Kigali City',
    estimated_budget_rwf: 45000, // Monthly stall tariff in RWF
    bid_security_rwf: 50000,
    description_en: 'Open competitive allocation for small vendors, individual hawkers transitioning to formal markets, and cooperative retailers for 64 newly renovated indoor covered market stalls designated for fresh vegetables, fruits, dry legumes, dairy, and household basic dry goods. Fixed monthly rental tariff: 45,000 RWF per standard stall.',
    description_rw: 'Igenamigambi ryo guha abacuruzi baciriritse, abazunguzayi bifuza gukorera ahantu hateguwe, n\'amakoperative ibibanza 64 byavuguruwe mu masoko ya Kimironko na Nyabugogo mu gice cy\'imboga, imbuto, ibinyampeke n\'amata. Ubukode bw\'ukwezi ni 45,000 RWF ku kibanza.',
    requirements_en: [
      'Valid Rwandan National ID (Indangamuntu 16 Digits) or Passport for resident foreigners',
      'Completed Vendor Profile in GMMS (Individual classification is accepted without TIN for small stalls)',
      'Commitment to City of Kigali market hygiene, waste separation, and operating hours guidelines',
      'Security deposit equivalent to 50,000 RWF (refundable upon contract expiry)'
    ],
    requirements_rw: [
      'Indangamuntu y\'umunyarwanda y\'imibare 16 cyangwa pasiporo ku banyamahanga batuye mu Rwanda',
      'Umwirondoro w\'umucuruzi wuzuye muri GMMS (Umucuruzi ku giti cye yemerewe gusaba niyo yaba adafite TIN)',
      'Kwemera kubahiriza isuku, gutandukanya imyanda, no kubahiriza amasaha yo gufungura no gufunga',
      'Ingwate y\'ikibanza ingana na 50,000 RWF (isubizwa amasezerano arangiye)'
    ],
    published_at: '2026-10-20',
    submission_deadline: '2026-11-25 17:00 PM',
    status: 'open'
  },
  {
    id: 5,
    tender_reference: 'TND/2026/KICUKIRO/RDS/022',
    title_en: 'Stone Paving (Cobblestones) and Stormwater Drain Protection on Gahanga-Nyanza Feeder Roads (4.2 km)',
    title_rw: 'Kubaka imihanda y\'amabuye (Cobblestone) no gukora imiyoboro y\'amazi y\'imvura mu muhanda wa Gahanga-Nyanza (km 4.2)',
    procuring_entity_en: 'Kicukiro District Administration - Department of One Stop Center',
    procuring_entity_rw: 'Akarere ka Kicukiro - Ishami rishinzwe Ubutaka n\'Ibikorwaremezo',
    category: 'road_construction',
    location_district: 'Kicukiro',
    location_province: 'Kigali City',
    estimated_budget_rwf: 620000000,
    bid_security_rwf: 12400000,
    description_en: 'Labor-intensive stone cobblestone paving works, excavation, sub-base preparation, and masonry drainage along 4.2 km of urban community access corridors in Kicukiro District.',
    description_rw: 'Imirimo yo gushyira amabuye mu muhanda ukoresha imbaraga z\'amaboko, gucukura imiyoboro y\'amazi, no gushyiraho inzira zikomeye mu bilometero 4.2 mu Karere ka Kicukiro.',
    requirements_en: [
      'RDB Registration in Civil / Masonry Works',
      'RRA Tax Clearance & RSSB certificate',
      'Bid Security of 12,400,000 RWF'
    ],
    requirements_rw: [
      'Icyemezo cya RDB mu bwubatsi bw\'amabuye',
      'Ibyemezo bya RRA na RSSB',
      'Ingarama y\'ipiganwa ingana na 12,400,000 RWF'
    ],
    published_at: '2026-10-16',
    submission_deadline: '2026-11-20 12:00 PM',
    status: 'open'
  },
  {
    id: 6,
    tender_reference: 'TND/2026/MUSANZE/MKT/005',
    title_en: 'Allocation of 40 Commercial Handicraft, Potato & Vegetable Stalls at Musanze Modern Market',
    title_rw: 'Gukodesha ibibanza 40 by\'ubukorikori, ibirayi n\'imboga mu Isoko rya Kijyambere rya Musanze',
    procuring_entity_en: 'Northern Province - Musanze District Joint Market Commission',
    procuring_entity_rw: 'Intara y\'Amajyaruguru - Akarere ka Musanze',
    category: 'market_stalls',
    location_district: 'Musanze',
    location_province: 'Northern Province',
    estimated_budget_rwf: 35000, // Monthly tariff
    bid_security_rwf: 35000,
    description_en: 'Allocation of covered retail spaces for regional agricultural produce and handmade Rwandan handicrafts at Musanze Modern Market complex.',
    description_rw: 'Gukodesha ibibanza by\'ubucuruzi mu isoko rya Musanze byahariwe ibirayi, imboga, n\'ibihangano by\'ubukorikori nyarwanda.',
    requirements_en: [
      'National ID (16 Digits) or Passport',
      'Registered Vendor Profile in GMMS',
      'Deposit of 35,000 RWF'
    ],
    requirements_rw: [
      'Indangamuntu y\'imibare 16 cyangwa Pasiporo',
      'Umwirondoro w\'umucuruzi muri GMMS',
      'Ingwate y\'ukwezi kumwe ingana na 35,000 RWF'
    ],
    published_at: '2026-10-19',
    submission_deadline: '2026-11-28 16:00 PM',
    status: 'open'
  }
];
