import React, { useState } from 'react';
import { Tender, TenderCategory, Language, User } from '../types';
import { translations } from '../data/translations';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Building2, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  HardHat,
  Apple,
  Shirt,
  Store,
  CheckCircle2
} from 'lucide-react';

interface TenderListProps {
  tenders: Tender[];
  currentLang: Language;
  currentUser: User | null;
  onSelectTender: (tender: Tender) => void;
  onApplyTender: (tender: Tender) => void;
  onOpenVendorProfile: () => void;
  selectedCategoryProp?: string;
}

export const TenderList: React.FC<TenderListProps> = ({
  tenders,
  currentLang,
  currentUser,
  onSelectTender,
  onApplyTender,
  onOpenVendorProfile,
  selectedCategoryProp = 'all',
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryProp);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  React.useEffect(() => {
    if (selectedCategoryProp) {
      setSelectedCategory(selectedCategoryProp);
    }
  }, [selectedCategoryProp]);

  // Filter tenders based on search and selected facets
  const filteredTenders = tenders.filter((item) => {
    const matchesSearch = 
      item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_rw.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tender_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.procuring_entity_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location_district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || item.location_district === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const getCategoryIcon = (category: TenderCategory) => {
    switch (category) {
      case 'road_construction':
        return <HardHat className="w-4 h-4 text-amber-600" />;
      case 'school_feeding':
        return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'school_uniforms':
        return <Shirt className="w-4 h-4 text-sky-600" />;
      case 'market_stalls':
        return <Store className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getCategoryLabel = (category: TenderCategory) => {
    switch (category) {
      case 'road_construction':
        return t.roadConstruction;
      case 'school_feeding':
        return t.schoolFeeding;
      case 'school_uniforms':
        return t.schoolUniforms;
      case 'market_stalls':
        return t.marketStalls;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase with Kigali Infrastructure Photograph */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 min-h-[220px] flex items-center">
        <img
          src="/src/assets/images/rwanda_kigali_infrastructure_1792747438925.jpg"
          alt="Modern Kigali Infrastructure and Green Hills"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent"></div>

        <div className="relative z-10 p-6 md:p-8 max-w-2xl text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 tracking-wider uppercase mb-2">
            <span>RPPA E-Procurement Registry</span>
            <span aria-hidden="true">·</span>
            <span>Vision 2050 Infrastructure & Markets</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.portalTitle}
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
            {t.portalSubtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{tenders.length} Active Public Markets</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <div>4 Specialized Sectors</div>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <div>100% Transparent Bidding</div>
          </div>
        </div>
      </div>

      {/* Mandatory Pre-Application Warning Banner (If user is logged in without completed profile) */}
      {currentUser && !currentUser.has_vendor_profile && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-amber-900">
                {t.preAppWarningTitle}
              </h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {t.preAppWarningDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenVendorProfile}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors whitespace-nowrap shrink-0"
          >
            {t.completeProfileCta}
          </button>
        </div>
      )}

      {/* Interactive Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.filterSearchPlaceholder}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* District Select */}
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs pl-3 pr-8 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-700 cursor-pointer"
              >
                <option value="all">{t.allDistricts}</option>
                <option value="Nyarugenge">Nyarugenge (Kigali)</option>
                <option value="Gasabo">Gasabo (Kigali)</option>
                <option value="Kicukiro">Kicukiro (Kigali)</option>
                <option value="Bugesera">Bugesera (Eastern)</option>
                <option value="Huye">Huye (Southern)</option>
                <option value="Musanze">Musanze (Northern)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {t.allSectors} ({tenders.length})
          </button>

          <button
            onClick={() => setSelectedCategory('road_construction')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'road_construction'
                ? 'bg-amber-600 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>{t.roadConstruction}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('school_feeding')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'school_feeding'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>{t.schoolFeeding}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('school_uniforms')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'school_uniforms'
                ? 'bg-sky-600 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>{t.schoolUniforms}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('market_stalls')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'market_stalls'
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t.marketStalls}</span>
          </button>
        </div>
      </div>

      {/* Tender Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTenders.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Tenders Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or clearing the selected category filters.
            </p>
          </div>
        ) : (
          filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-sky-300 hover:shadow-xs transition-all group"
            >
              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{tender.tender_reference}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-600 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {tender.location_district}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-700 font-sans">
                    {getCategoryIcon(tender.category)}
                    <span className="font-medium text-[11px]">{getCategoryLabel(tender.category)}</span>
                  </div>
                </div>

                {/* Main Tender Title */}
                <h3 
                  onClick={() => onSelectTender(tender)}
                  className="text-sm font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors cursor-pointer"
                >
                  {currentLang === 'en' ? tender.title_en : tender.title_rw}
                </h3>

                {/* Procuring Entity */}
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {currentLang === 'en' ? tender.procuring_entity_en : tender.procuring_entity_rw}
                  </span>
                </p>

                {/* Brief description snippet */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {currentLang === 'en' ? tender.description_en : tender.description_rw}
                </p>

                {/* Financial Value & Deadline Panel */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {tender.category === 'market_stalls' ? t.monthlyTariff : t.estimatedBudget}
                    </span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                      {tender.estimated_budget_rwf.toLocaleString()} RWF
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">{t.deadline}</span>
                    <span className="font-medium text-rose-700 font-mono text-[11px] flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3 text-rose-500" />
                      {tender.submission_deadline.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectTender(tender)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
                >
                  {t.viewDetails}
                </button>

                <button
                  onClick={() => onApplyTender(tender)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <span>{t.applyNow}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
