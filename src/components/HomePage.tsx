import React from 'react';
import { Language, User, Tender } from '../types';
import { translations } from '../data/translations';
import { 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  HardHat, 
  Apple, 
  Shirt, 
  Store, 
  Building2, 
  Clock, 
  ChevronRight,
  Award,
  Users
} from 'lucide-react';

interface HomePageProps {
  currentLang: Language;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenVendorProfile: () => void;
  onNavigateToTenders: (category?: string) => void;
  tenders: Tender[];
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLang,
  currentUser,
  onOpenAuth,
  onOpenVendorProfile,
  onNavigateToTenders,
  tenders,
}) => {
  const t = translations[currentLang];

  const totalValueRwf = tenders.reduce((acc, curr) => acc + curr.estimated_budget_rwf, 0);

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION WITH AUTHENTIC KIGALI PHOTOGRAPHY */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-950 min-h-[460px] flex items-center">
        {/* Background Image with Measured Contrast Scrim */}
        <img
          src="/src/assets/images/rwanda_kigali_infrastructure_1792747438925.jpg"
          alt="Modern Kigali Infrastructure and Landscape"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/40"></div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl text-white space-y-5">
          {/* Official Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-sky-300 font-semibold uppercase tracking-wider backdrop-blur-xs">
            <span>🇷🇼 {t.republicOfRwanda}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Rwanda Public Procurement Authority (RPPA)</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {currentLang === 'en' 
              ? 'Government Market & Tender Management System' 
              : 'Urwego rwo Gutanga Amasoko ya Leta mu Rwanda'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {currentLang === 'en'
              ? 'A single official transparent e-procurement portal for road infrastructure contracts, school feeding food supplies, standardized school uniforms, and municipal commercial market stall allocations across Rwanda.'
              : 'Sisitemu imwe yemewe kandi ikorera mu mucyo yo gupiganira amasoko y\'imihanda, kugaburira abanyeshuri, impuzankano z\'amashuri, no gukodesha ibibanza mu masoko ya kijyambere mu turere twose tw\'u Rwanda.'}
          </p>

          {/* PROMINENT SIGNUP & LOGIN BUTTONS ROW */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!currentUser ? (
              <>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-6 py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-sky-200" />
                  <span>{currentLang === 'en' ? 'Register Account (NID / Passport)' : 'Kwiyandikisha (Indangamuntu)'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-bold rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-200" />
                  <span>{currentLang === 'en' ? 'Sign In to Portal' : 'Kwinjira muri Sisitemu'}</span>
                </button>

                <button
                  onClick={() => onNavigateToTenders()}
                  className="px-4 py-3.5 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>{t.exploreMarkets}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateToTenders()}
                  className="px-6 py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t.exploreMarkets}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {!currentUser.has_vendor_profile ? (
                  <button
                    onClick={onOpenVendorProfile}
                    className="px-5 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>{t.completeProfileCta}</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenVendorProfile}
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Vendor Profile Verified</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Quantitative Facts */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-mono">
            <div>
              <strong className="text-white font-bold text-sm">{tenders.length}</strong> Open Markets
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <strong className="text-white font-bold text-sm">{(totalValueRwf / 1000000000).toFixed(2)}B+ RWF</strong> Estimated Value
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <strong className="text-white font-bold text-sm">4</strong> Key Sectors
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <strong className="text-white font-bold text-sm">30</strong> Districts
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR MANDATORY MARKET SECTORS (WITH REAL DOCUMENTARY PHOTOGRAPHY) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1 font-mono">
              National Tender Portfolios
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentLang === 'en' 
                ? 'Core Government Market Sectors' 
                : 'Ibyiciro Bikuru by\'Amasoko ya Leta'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {currentLang === 'en'
                ? 'Select a sector below to explore specific technical specifications, required licenses, and submit your bid.'
                : 'Hitamo icyiciro cy\'isoko wifuza kurebamo ibyangombwa bisabwa no gupiganira isoko.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateToTenders()}
            className="text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>{t.exploreMarkets} ({tenders.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTOR 1: ROAD WORKS & INFRASTRUCTURE */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/rwanda_road_construction_1792748585745.jpg"
                alt="Road construction in Rwanda with asphalt machinery and civil engineers"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.roadConstruction}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] text-slate-400 font-mono mb-1">
                  City of Kigali & MININFRA · Class A & B Works
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentLang === 'en' 
                    ? 'Road Works, Asphalt Paving & Drainage Channels' 
                    : 'Ubwubatsi bw\'Imihanda, Kaburimbo n\'Imiyoboro y\'Amazi'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Rehabilitation of urban feeder corridors, cobblestone paving, pedestrian storm drainage, and highway civil engineering contracts.'
                    : 'Kuvugurura imihanda y\'imigenderano, gushyiramo kaburimbo n\'amabuye (cobblestones), no kubaka imiyoboro y\'amazi y\'imvura mu turere twose.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Typical Contract Value</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">620M – 1.45B RWF</span>
                </div>
                <button
                  onClick={() => onNavigateToTenders('road_construction')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{currentLang === 'en' ? 'View Tenders' : 'Reba Amasoko'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTOR 2: SCHOOL FEEDING PROGRAM */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/rwanda_school_feeding_1792748600612.jpg"
                alt="Rwandan secondary school students receiving fortified lunch meals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.schoolFeeding}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] text-slate-400 font-mono mb-1">
                  MINEDUC & Joint District School Boards
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentLang === 'en' 
                    ? 'Bulk School Feeding & Fortified Agro-Supplies' 
                    : 'Gahunda yo Kugaburira Abanyeshuri ku Mashuri ya Leta'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Bulk procurement and hygienic delivery of iron-fortified maize flour (kawunga), dry red beans, and Rwandan processed rice for secondary schools.'
                    : 'Gutanga ibiribwa byujuje ubuziranenge bwa RSB/FDA (Kawunga ifite ubutare, ibihyimbo by\'umutuku, n\'umuceri) mu mashuri yisumbuye.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">District Bulk Budget</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">280M+ RWF</span>
                </div>
                <button
                  onClick={() => onNavigateToTenders('school_feeding')}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{currentLang === 'en' ? 'View Tenders' : 'Reba Amasoko'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTOR 3: SCHOOL UNIFORMS & TEXTILE MANUFACTURING */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/rwanda_textile_uniforms_1792748617016.jpg"
                alt="Made in Rwanda modern textile workshop tailoring school uniforms"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.schoolUniforms}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] text-slate-400 font-mono mb-1">
                  Made in Rwanda · Tailoring Cooperatives & Garment Plants
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentLang === 'en' 
                    ? 'Standardized School Uniforms & Sportswear' 
                    : 'Kudoda no Gutanga Impuzankano z\'Amashuri'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Bulk production of durable poplin shirts, pleated skirts, trousers, and embroidered acrylic knit sweaters meeting MINEDUC color standards.'
                    : 'Kudoda no gukwirakwiza impuzankano z\'abanyeshuri (amashati, amajipo, amapantalo, n\'imipira y\'imbeho) zikorewe mu nganda zo mu Rwanda.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">District Volume</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">14,200 Sets · 115M RWF</span>
                </div>
                <button
                  onClick={() => onNavigateToTenders('school_uniforms')}
                  className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{currentLang === 'en' ? 'View Tenders' : 'Reba Amasoko'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTOR 4: MUNICIPAL MARKET STALL ALLOCATIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/rwanda_market_stalls_1792748632758.jpg"
                alt="Kimironko modern covered municipal market hall with fresh produce stalls"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.marketStalls}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] text-slate-400 font-mono mb-1">
                  City of Kigali & District Market Authorities
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentLang === 'en' 
                    ? 'Modern Covered Market Stall Allocations & Leases' 
                    : 'Gukodesha Ibibanza mu Masoko ya Kijyambere'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {currentLang === 'en'
                    ? '3-year renewable lease allocations at Kimironko, Nyabugogo, and Musanze modern markets for fresh vegetables, fruits, dry grains, and dairy (TIN is optional for individual hawkers).'
                    : 'Guhabwa ibibanza by\'ubucuruzi buciriritse mu masoko ya Kimironko na Nyabugogo (Umucuruzi ku giti cye yemerewe gusaba niyo yaba adafite TIN).'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Monthly Fixed Tariff</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">45,000 RWF / month</span>
                </div>
                <button
                  onClick={() => onNavigateToTenders('market_stalls')}
                  className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{currentLang === 'en' ? 'View Stalls' : 'Reba Ibibanza'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS: THE 4-STEP OFFICIAL PROCUREMENT FLOW */}
      <section className="bg-slate-100/70 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="text-xs font-bold text-sky-800 uppercase tracking-wider font-mono">
            Mandatory Process & Business Logic
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {currentLang === 'en' ? 'How the Procurement Process Works' : 'Uko Sisitemu yo Gusaba Isoko Ikora'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'en'
              ? 'Compliant with Law N° 62/2018 governing public procurement in Rwanda.'
              : 'Byubahirije amategeko agenga amasoko ya Leta mu Rwanda.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-mono font-bold text-xs flex items-center justify-center">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentLang === 'en' ? 'Register Identity' : 'Kwiyandikisha'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentLang === 'en'
                ? 'Sign up with 16-digit Rwandan National ID (Indangamuntu) or Foreign Passport, phone number, and email.'
                : 'Koresha indangamuntu y\'imibare 16 (itangizwa na 1, 2, 3) cyangwa pasiporo ku banyamahanga.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 border-sky-300 ring-1 ring-sky-500/20">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentLang === 'en' ? 'Vendor Profile' : 'Umwirondoro'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentLang === 'en'
                ? 'Mandatory pre-application form: Individual or Company, 9-digit TIN (mandatory for companies), and experience.'
                : 'Ibisabwa mbere yo gusaba: Hitamo niba uri umuntu cyangwa sosiyete, ushyiremo TIN n\'uburambe.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-mono font-bold text-xs flex items-center justify-center">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentLang === 'en' ? 'Submit Bid' : 'Gusaba Isoko'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentLang === 'en'
                ? 'System pulls verified vendor details. Submit financial offer in RWF, timeline, and anti-corruption pledge.'
                : 'Sisitemu ihita yerekana amakuru yawe. Tanga igiciro cy\'isoko, iminsi, no kwemeza kurwanya ruswa.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentLang === 'en' ? 'Official Receipt' : 'Icyemezo Cyemewe'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentLang === 'en'
                ? 'Receive unique tracking code (RW-TND-2026-XXXX) and printable submission certificate with QR stamp.'
                : 'Bona nimero y\'idosiye yihariye n\'icyemezo cyo gucapa (receipt) gifite kashe yemewe ya Leta.'}
            </p>
          </div>

        </div>
      </section>

      {/* 4. CALL TO ACTION / ONBOARDING BANNER */}
      <section className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-sky-700/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-sky-300 text-xs font-bold uppercase tracking-wider font-mono">
              Ready to participate in Rwanda Public Markets?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              {currentLang === 'en'
                ? 'Create Your Vendor Account in Less than 2 Minutes'
                : 'Fungura Konti Y\'Ubucuruzi mu Minota Itarenze 2'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              {currentLang === 'en'
                ? 'All Rwandan citizens with an active Indangamuntu or international enterprises with valid passports can register and bid transparently.'
                : 'Abanyarwanda bose bafite indangamuntu n\'amasosiyete yo hanze bafite pasiporo bahawe ikaze gupiganira amasoko ya Leta mu buryo bworoshye kandi bunoze.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 py-3.5 bg-white text-sky-900 hover:bg-sky-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-sky-800" />
              <span>{currentLang === 'en' ? 'Register Account Now' : 'Kwiyandikisha Ubu'}</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-6 py-3.5 bg-sky-950/60 hover:bg-sky-950 text-white border border-sky-400/30 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-sky-300" />
              <span>{currentLang === 'en' ? 'Sign In / Kwinjira' : 'Kwinjira muri Sisitemu'}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
