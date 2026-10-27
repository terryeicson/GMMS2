import React from 'react';
import { Tender, Language } from '../types';
import { translations } from '../data/translations';
import { X, Building2, MapPin, Calendar, ShieldCheck, CheckSquare, ArrowRight, DollarSign } from 'lucide-react';

interface TenderDetailsModalProps {
  tender: Tender | null;
  currentLang: Language;
  onClose: () => void;
  onApply: (tender: Tender) => void;
}

export const TenderDetailsModal: React.FC<TenderDetailsModalProps> = ({
  tender,
  currentLang,
  onClose,
  onApply,
}) => {
  if (!tender) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-bold text-sky-800">{tender.tender_reference}</span>
              <span aria-hidden="true">·</span>
              <span>{tender.location_district} District</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
              {currentLang === 'en' ? tender.title_en : tender.title_rw}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs">
          
          {/* Entity & Location Strip */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">{t.procuringEntity}</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {currentLang === 'en' ? tender.procuring_entity_en : tender.procuring_entity_rw}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Location & Province</span>
              <span className="font-semibold text-slate-900 block mt-0.5">
                {tender.location_district} District, {tender.location_province}
              </span>
            </div>
          </div>

          {/* Key Financial & Deadline Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-400 block">
                {tender.category === 'market_stalls' ? t.monthlyTariff : t.estimatedBudget}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums block mt-0.5">
                {tender.estimated_budget_rwf.toLocaleString()} RWF
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-400 block">Bid Security Required</span>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums block mt-0.5">
                {tender.bid_security_rwf.toLocaleString()} RWF
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block">{t.deadline}</span>
              <span className="text-xs font-semibold text-rose-700 font-mono block mt-1">
                {tender.submission_deadline}
              </span>
            </div>
          </div>

          {/* Scope & Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Tender Scope & Specifications / Ibisobanuro by'Isoko
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              {currentLang === 'en' ? tender.description_en : tender.description_rw}
            </p>
          </div>

          {/* Mandatory Submission Requirements */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Mandatory Compliance Requirements / Ibisabwa by'Agahato</span>
            </h4>
            <ul className="space-y-2">
              {(currentLang === 'en' ? tender.requirements_en : tender.requirements_rw).map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-normal">{req}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer with Primary Apply Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            {t.close}
          </button>
          
          <button
            onClick={() => {
              onClose();
              onApply(tender);
            }}
            className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <span>{t.applyNow}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
