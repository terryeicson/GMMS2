import React from 'react';
import { Application, Language } from '../types';
import { translations } from '../data/translations';
import { FileText, Clock, CheckCircle2, AlertCircle, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

interface MyApplicationsViewProps {
  applications: Application[];
  currentLang: Language;
  onViewReceipt: (application: Application) => void;
  onBrowseTenders: () => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  currentLang,
  onViewReceipt,
  onBrowseTenders,
}) => {
  const t = translations[currentLang];

  const getStatusStep = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return 1;
      case 'administrative_review':
        return 2;
      case 'technical_evaluation':
        return 3;
      case 'financial_opening':
        return 4;
      case 'awarded':
        return 5;
      case 'rejected':
        return -1;
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="text-sky-700 font-semibold">{t.statusSubmitted}</span>;
      case 'administrative_review':
        return <span className="text-amber-700 font-semibold">{t.statusAdminReview}</span>;
      case 'technical_evaluation':
        return <span className="text-indigo-700 font-semibold">{t.statusTechnical}</span>;
      case 'financial_opening':
        return <span className="text-purple-700 font-semibold">{t.statusFinancial}</span>;
      case 'awarded':
        return <span className="text-emerald-700 font-semibold">{t.statusAwarded}</span>;
      case 'rejected':
        return <span className="text-rose-700 font-semibold">{t.statusRejected}</span>;
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Tender Applications Submitted Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          You haven't submitted any bids for government markets, road construction, school feeding, or market stalls.
        </p>
        <button
          onClick={onBrowseTenders}
          className="mt-5 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
        >
          <span>{t.navTenders}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.navMyApps}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track evaluation stages, download submission receipts, and review compliance status.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          Total Submissions: <strong className="text-slate-900">{applications.length}</strong>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => {
          const step = getStatusStep(app.status);

          return (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Top metadata strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {app.application_tracking_code}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">{app.tender.tender_reference}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 font-sans">
                    <Clock className="w-3 h-3" />
                    {app.submitted_at}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs">
                    {getStatusBadge(app.status)}
                  </span>
                  <button
                    onClick={() => onViewReceipt(app)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    title="View Official Certificate"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>

              {/* Tender Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {currentLang === 'en' ? app.tender.title_en : app.tender.title_rw}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentLang === 'en' ? app.tender.procuring_entity_en : app.tender.procuring_entity_rw} · {app.tender.location_district} District
                  </p>

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-0.5">Submitted Methodology Summary:</span>
                    <p className="italic text-[11px]">{app.technical_proposal_summary}</p>
                  </div>
                </div>

                {/* Financial & Delivery Metrics */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Submitted Financial Offer</span>
                    <span className="font-mono font-bold text-slate-900 text-base tabular-nums">
                      {app.financial_offer_rwf.toLocaleString()} RWF
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Est. Tender: {app.tender.estimated_budget_rwf.toLocaleString()} RWF
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 block font-medium">Proposed Delivery</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {app.proposed_delivery_days} Calendar Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress evaluation stages bar */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  National Procurement Evaluation Progress
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border text-center ${
                    step >= 1 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <div className="text-[10px] opacity-75">Step 1</div>
                    <div>Received</div>
                  </div>

                  <div className={`p-2 rounded-lg border text-center ${
                    step >= 2 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <div className="text-[10px] opacity-75">Step 2</div>
                    <div>Admin Screening</div>
                  </div>

                  <div className={`p-2 rounded-lg border text-center ${
                    step >= 3 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <div className="text-[10px] opacity-75">Step 3</div>
                    <div>Technical</div>
                  </div>

                  <div className={`p-2 rounded-lg border text-center ${
                    step >= 4 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <div className="text-[10px] opacity-75">Step 4</div>
                    <div>Financial</div>
                  </div>

                  <div className={`p-2 rounded-lg border text-center ${
                    step >= 5 ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <div className="text-[10px] opacity-75">Step 5</div>
                    <div>Award Decision</div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
