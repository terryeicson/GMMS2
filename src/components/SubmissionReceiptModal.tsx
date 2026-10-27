import React from 'react';
import { Application, Language } from '../types';
import { translations } from '../data/translations';
import { X, Printer, CheckCircle2, QrCode, ShieldCheck, Download } from 'lucide-react';

interface SubmissionReceiptModalProps {
  application: Application | null;
  currentLang: Language;
  onClose: () => void;
}

export const SubmissionReceiptModal: React.FC<SubmissionReceiptModalProps> = ({
  application,
  currentLang,
  onClose,
}) => {
  if (!application) return null;
  const t = translations[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Actions */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Submission Successfully Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printReceipt}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="printable-receipt" className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 bg-white">
          
          {/* Official Emblem & Header */}
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 mx-auto flex items-center justify-center text-2xl font-bold mb-2 shadow-2xs">
              🇷🇼
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Repubulika y'u Rwanda · Republic of Rwanda
            </div>
            <div className="text-sm font-bold text-slate-900">
              Rwanda Public Procurement Authority (RPPA)
            </div>
            <div className="text-xs text-slate-600 font-medium">
              National E-Procurement Portal (GMMS Rwanda)
            </div>
          </div>

          {/* Certificate Title */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl text-center">
            <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
              {t.submissionReceiptTitle}
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono tracking-tight mt-1">
              {application.application_tracking_code}
            </div>
            <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
              Recorded at: {application.submitted_at}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Tender Reference</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">
                {application.tender.tender_reference}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Market Title</span>
              <span className="col-span-2 font-bold text-slate-900">
                {currentLang === 'en' ? application.tender.title_en : application.tender.title_rw}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Procuring Entity</span>
              <span className="col-span-2 text-slate-800">
                {currentLang === 'en' ? application.tender.procuring_entity_en : application.tender.procuring_entity_rw}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Applicant Name</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {application.applicant_name}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">TIN Number</span>
              <span className="col-span-2 font-mono text-slate-800">
                {application.vendor_profile.tin_number || 'N/A (Individual Hawker)'}
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Submitted Financial Offer</span>
              <span className="col-span-2 font-mono font-bold text-sky-800 text-sm">
                {application.financial_offer_rwf.toLocaleString()} RWF
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Proposed Timeline</span>
              <span className="col-span-2 font-mono text-slate-800">
                {application.proposed_delivery_days} Calendar Days
              </span>
            </div>

            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Initial Status</span>
              <span className="col-span-2 font-semibold text-emerald-700">
                Administrative Screening Pending
              </span>
            </div>
          </div>

          {/* Verification Stamp & QR Code representation */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-slate-300 rounded-lg p-1.5 flex flex-col items-center justify-center bg-slate-50 font-mono text-[9px] text-slate-400">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                  <span>Digitally Sealed in National Registry</span>
                </div>
                <div>Hash: {application.application_tracking_code}-RPPA-2026</div>
                <div>Verification URL: gmms.gov.rw/verify/{application.application_tracking_code}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="w-20 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono uppercase">
                Official Stamp
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
