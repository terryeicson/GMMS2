import React, { useState } from 'react';
import { Tender, Application, User, Language } from '../types';
import { translations } from '../data/translations';
import { X, CheckCircle2, ShieldAlert, FileText, ArrowRight, Building2, User as UserIcon } from 'lucide-react';

interface ApplyTenderModalProps {
  tender: Tender | null;
  currentUser: User;
  currentLang: Language;
  onClose: () => void;
  onSubmitApplication: (appData: Omit<Application, 'id' | 'application_tracking_code' | 'submitted_at' | 'status'>) => void;
}

export const ApplyTenderModal: React.FC<ApplyTenderModalProps> = ({
  tender,
  currentUser,
  currentLang,
  onClose,
  onSubmitApplication,
}) => {
  if (!tender) return null;
  const t = translations[currentLang];

  const vendorProfile = currentUser.vendor_profile!;

  const [financialOffer, setFinancialOffer] = useState<number>(
    tender.category === 'market_stalls' ? 45000 : Math.round(tender.estimated_budget_rwf * 0.95)
  );
  const [deliveryDays, setDeliveryDays] = useState<number>(
    tender.category === 'road_construction' ? 180 : tender.category === 'school_feeding' ? 30 : 45
  );
  const [technicalSummary, setTechnicalSummary] = useState<string>(
    tender.category === 'market_stalls'
      ? 'Daily commercial trading operation with certified hygiene compliance and scheduled fresh produce turnover.'
      : 'Comprehensive execution plan with experienced certified personnel, quality-assured raw materials, and regional logistics fleet.'
  );
  const [antiCorruptionSigned, setAntiCorruptionSigned] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (financialOffer <= 0) {
      setErrorMsg(currentLang === 'en' ? 'Please provide a valid financial bid amount.' : 'Tanga igiciro cyemewe mu mafaranga y\'u Rwanda.');
      return;
    }

    if (deliveryDays <= 0 || deliveryDays > 730) {
      setErrorMsg(currentLang === 'en' ? 'Please provide a realistic delivery timeline (1-730 days).' : 'Andika iminsi nyayo yo kurangiza isoko.');
      return;
    }

    if (technicalSummary.trim().length < 25) {
      setErrorMsg(currentLang === 'en' ? 'Please describe your technical methodology (at least 25 characters).' : 'Tanga ibisobanuro birambuye bya tekiniki.');
      return;
    }

    if (!antiCorruptionSigned) {
      setErrorMsg(currentLang === 'en' ? 'You must accept the anti-corruption declaration.' : 'Ugomba kwemeza igihango cyo kurwanya ruswa.');
      return;
    }

    onSubmitApplication({
      tender_id: tender.id,
      tender,
      user_id: currentUser.id,
      vendor_profile: vendorProfile,
      applicant_name: vendorProfile.company_name || currentUser.full_name,
      applicant_email: currentUser.email,
      applicant_phone: currentUser.phone_number,
      financial_offer_rwf: Number(financialOffer),
      proposed_delivery_days: Number(deliveryDays),
      technical_proposal_summary: technicalSummary.trim(),
      anti_corruption_pledge_signed: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-800">
              <span className="font-bold">{tender.tender_reference}</span>
              <span aria-hidden="true">·</span>
              <span>{tender.location_district}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
              {t.bidFormTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verified Pre-Application Vendor Profile Strip (Pulled details) */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
              Verified Applicant Dossier
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vendor Profile Connected</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-800 font-medium">
            <div className="truncate">
              <strong>Applicant:</strong> {vendorProfile.company_name || currentUser.full_name}
            </div>
            <div className="font-mono text-right truncate">
              <strong>TIN:</strong> {vendorProfile.tin_number || 'N/A (Individual)'}
            </div>
            <div>
              <strong>Type:</strong> {vendorProfile.business_type === 'company' ? 'Registered Company' : 'Individual Vendor'}
            </div>
            <div className="text-right">
              <strong>Experience:</strong> {vendorProfile.years_of_experience} Years
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tender Title Reminder */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Tender Target</span>
            <span className="font-bold text-slate-900 block mt-0.5">
              {currentLang === 'en' ? tender.title_en : tender.title_rw}
            </span>
          </div>

          {/* Financial Offer Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                {t.bidOfferLabel} *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Est: {tender.estimated_budget_rwf.toLocaleString()} RWF
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 font-mono">
                RWF
              </span>
              <input
                type="number"
                min={1000}
                value={financialOffer}
                onChange={(e) => setFinancialOffer(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold pl-12 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {tender.category === 'market_stalls'
                ? 'Monthly fixed stall rental fee bid in Rwandan Francs.'
                : 'Total lump-sum or unit price bid in Rwandan Francs (exclusive or inclusive of VAT).'}
            </p>
          </div>

          {/* Proposed Delivery Timeline */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t.deliveryDaysLabel} *
            </label>
            <input
              type="number"
              min={1}
              max={730}
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Calendar days required from contract signing to final completion/delivery.
            </p>
          </div>

          {/* Technical Execution Proposal */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t.technicalSummaryLabel} *
            </label>
            <textarea
              rows={3}
              value={technicalSummary}
              onChange={(e) => setTechnicalSummary(e.target.value)}
              placeholder="Outline your execution methodology, staffing, equipment availability, or stall trading inventory plan..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              required
            />
          </div>

          {/* Anti-Corruption Declaration */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={antiCorruptionSigned}
                onChange={(e) => setAntiCorruptionSigned(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <strong className="block font-bold text-xs">
                  {t.antiCorruptionPledgeTitle}
                </strong>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  {t.antiCorruptionPledgeText}
                </p>
              </div>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.submitBidCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
