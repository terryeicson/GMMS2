import React, { useState, useEffect } from 'react';
import { VendorProfile, BusinessType, TenderCategory, Language, User } from '../types';
import { translations } from '../data/translations';
import { X, Building2, User as UserIcon, ShieldAlert, CheckCircle2, FileCheck } from 'lucide-react';

interface VendorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSaveProfile: (profile: VendorProfile) => void;
  currentLang: Language;
}

export const VendorProfileModal: React.FC<VendorProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  currentLang,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  const existingProfile = currentUser?.vendor_profile;

  const [businessType, setBusinessType] = useState<BusinessType>(existingProfile?.business_type || 'company');
  const [companyName, setCompanyName] = useState<string>(existingProfile?.company_name || '');
  const [rdbNumber, setRdbNumber] = useState<string>(existingProfile?.rdb_registration_number || '');
  const [tinNumber, setTinNumber] = useState<string>(existingProfile?.tin_number || '');
  const [businessCategory, setBusinessCategory] = useState<TenderCategory | 'general_supplies' | 'consultancy'>(
    existingProfile?.business_category || 'road_construction'
  );
  const [experienceYears, setExperienceYears] = useState<number>(existingProfile?.years_of_experience ?? 5);
  const [province, setProvince] = useState<string>(existingProfile?.province || 'Kigali City');
  const [district, setDistrict] = useState<string>(existingProfile?.district || 'Nyarugenge');
  const [servicesDescription, setServicesDescription] = useState<string>(existingProfile?.services_description || '');
  const [hasTaxClearance, setHasTaxClearance] = useState<boolean>(existingProfile?.has_rra_tax_clearance ?? true);
  const [hasRssbClearance, setHasRssbClearance] = useState<boolean>(existingProfile?.has_rssb_clearance ?? true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (existingProfile) {
      setBusinessType(existingProfile.business_type);
      setCompanyName(existingProfile.company_name || '');
      setRdbNumber(existingProfile.rdb_registration_number || '');
      setTinNumber(existingProfile.tin_number || '');
      setBusinessCategory(existingProfile.business_category);
      setExperienceYears(existingProfile.years_of_experience);
      setProvince(existingProfile.province);
      setDistrict(existingProfile.district);
      setServicesDescription(existingProfile.services_description);
      setHasTaxClearance(existingProfile.has_rra_tax_clearance);
      setHasRssbClearance(existingProfile.has_rssb_clearance);
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Strict validation
    if (businessType === 'company') {
      if (!companyName.trim()) {
        setErrorMsg(currentLang === 'en' ? 'Company Legal Name is required.' : 'Izina rya sosiyete rirakenewe.');
        return;
      }
      // TIN is strictly required for registered companies (9 digits)
      const cleanTin = tinNumber.trim();
      if (!cleanTin || !/^\d{9}$/.test(cleanTin)) {
        setErrorMsg(
          currentLang === 'en'
            ? 'Tax Identification Number (TIN) is mandatory for registered companies and must be exactly 9 numeric digits.'
            : 'TIN y\'imibare 9 irakenewe ku masosiyete yanditswe mu RDB.'
        );
        return;
      }
    } else {
      // For individuals, TIN is optional, but if provided, must be 9 digits
      const cleanTin = tinNumber.trim();
      if (cleanTin && !/^\d{9}$/.test(cleanTin)) {
        setErrorMsg(
          currentLang === 'en'
            ? 'If provided, TIN must be exactly 9 numeric digits.'
            : 'Niba ushyizemo TIN, igomba kuba igizwe n\'imibare 9.'
        );
        return;
      }
    }

    if (servicesDescription.trim().length < 20) {
      setErrorMsg(
        currentLang === 'en'
          ? 'Please provide a descriptive explanation of your services/products (minimum 20 characters).'
          : 'Tanga ibisobanuro birambuye by\'ibicuruzwa byawe (byibuze inyuguti 20).'
      );
      return;
    }

    const updatedProfile: VendorProfile = {
      id: existingProfile?.id || Date.now(),
      user_id: currentUser?.id || 1,
      business_type: businessType,
      company_name: businessType === 'company' ? companyName.trim() : undefined,
      rdb_registration_number: rdbNumber.trim() || undefined,
      tin_number: tinNumber.trim() || undefined,
      business_category: businessCategory,
      years_of_experience: Number(experienceYears),
      province,
      district,
      services_description: servicesDescription.trim(),
      has_rra_tax_clearance: hasTaxClearance,
      has_rssb_clearance: hasRssbClearance,
      is_profile_completed: true,
      updated_at: new Date().toISOString().split('T')[0],
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                RPPA Standard Form VP-1
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {t.vendorProfileModalTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.vendorProfileSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Business Entity Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {t.businessType} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                businessType === 'individual'
                  ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="bizType"
                  value="individual"
                  checked={businessType === 'individual'}
                  onChange={() => setBusinessType('individual')}
                  className="mt-0.5 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.individualTrader}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {t.individualDesc}
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                businessType === 'company'
                  ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="bizType"
                  value="company"
                  checked={businessType === 'company'}
                  onChange={() => setBusinessType('company')}
                  className="mt-0.5 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.registeredCompany}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {t.companyDesc}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Company Name & RDB Reg Number */}
          {businessType === 'company' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.companyName} *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Kigali Civil Infrastructure Ltd"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.rdbNumber}
                </label>
                <input
                  type="text"
                  value={rdbNumber}
                  onChange={(e) => setRdbNumber(e.target.value)}
                  placeholder="e.g. RDB-2022-B-8921"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* TIN and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.tinNumber} {businessType === 'company' ? <span className="text-rose-600 font-bold">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
              </label>
              <input
                type="text"
                maxLength={9}
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9 digits (e.g. 100482931)"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {businessType === 'company' 
                  ? 'Mandatory 9-digit RRA Tax Identification Number.' 
                  : 'Optional for individual hawkers / small market stall applicants.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.category} *
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="road_construction">{t.roadConstruction}</option>
                <option value="school_feeding">{t.schoolFeeding}</option>
                <option value="school_uniforms">{t.schoolUniforms}</option>
                <option value="market_stalls">{t.marketStalls}</option>
                <option value="general_supplies">General Supplies & Logistics</option>
                <option value="consultancy">Consultancy & Advisory Services</option>
              </select>
            </div>
          </div>

          {/* Experience and District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.experienceYears} *
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.district} *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="Nyarugenge">Nyarugenge (City of Kigali)</option>
                <option value="Gasabo">Gasabo (City of Kigali)</option>
                <option value="Kicukiro">Kicukiro (City of Kigali)</option>
                <option value="Bugesera">Bugesera (Eastern Province)</option>
                <option value="Rwamagana">Rwamagana (Eastern Province)</option>
                <option value="Huye">Huye (Southern Province)</option>
                <option value="Muhanga">Muhanga (Southern Province)</option>
                <option value="Musanze">Musanze (Northern Province)</option>
                <option value="Rubavu">Rubavu (Western Province)</option>
              </select>
            </div>
          </div>

          {/* Description of Services/Products */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.servicesDescription} *
            </label>
            <textarea
              rows={3}
              value={servicesDescription}
              onChange={(e) => setServicesDescription(e.target.value)}
              placeholder="Detail your operational capacity, warehouse logistics, manufacturing workshops, or retail stall trade experience..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              required
            />
          </div>

          {/* Legal Compliance Declarations */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTaxClearance}
                onChange={(e) => setHasTaxClearance(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="text-[11px] text-slate-700">
                {t.taxClearanceDeclaration}
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRssbClearance}
                onChange={(e) => setHasRssbClearance(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <span className="text-[11px] text-slate-700">
                {t.rssbDeclaration}
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.saveProfile}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
