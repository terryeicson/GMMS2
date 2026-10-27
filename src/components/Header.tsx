import React from 'react';
import { Language, User } from '../types';
import { translations } from '../data/translations';
import { Globe, User as UserIcon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenVendorProfile: () => void;
  activeTab: 'home' | 'tenders' | 'my-apps' | 'backend-code';
  onSelectTab: (tab: 'home' | 'tenders' | 'my-apps' | 'backend-code') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenVendorProfile,
  activeTab,
  onSelectTab,
}) => {
  const t = translations[currentLang];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Rwandan National Trilateral Ribbon */}
      <div className="h-1.5 w-full flex" aria-hidden="true">
        <div className="w-1/2 bg-[#0075C9]"></div>
        <div className="w-1/4 bg-[#FAD201]"></div>
        <div className="w-1/4 bg-[#20603D]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Action) */}
        <div className="flex items-center justify-between gap-8 h-18 py-3">
          
          {/* ZONE 1: Single element brand wordmark with national emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg shadow-2xs font-bold text-sky-800">
              🇷🇼
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase block leading-none">
                {t.republicOfRwanda}
              </span>
              <button 
                onClick={() => onSelectTab('home')}
                className="text-base font-bold text-slate-900 tracking-tight hover:text-sky-700 transition-colors whitespace-nowrap block mt-0.5 text-left cursor-pointer"
              >
                GMMS Rwanda <span className="font-normal text-slate-400">·</span> <span className="text-sm font-medium text-slate-600">E-Procurement</span>
              </button>
            </div>
          </div>

          {/* ZONE 2: 4-5 Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs font-semibold cursor-pointer ${
                activeTab === 'home' ? 'border-sky-700 text-sky-800' : 'border-transparent text-slate-600'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => onSelectTab('tenders')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs font-semibold cursor-pointer ${
                activeTab === 'tenders' ? 'border-sky-700 text-sky-800' : 'border-transparent text-slate-600'
              }`}
            >
              {t.navTenders}
            </button>

            <button
              onClick={onOpenVendorProfile}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.navVendorProfile}</span>
              {currentUser && (
                currentUser.has_vendor_profile ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )
              )}
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('login');
                } else {
                  onSelectTab('my-apps');
                }
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs font-semibold cursor-pointer ${
                activeTab === 'my-apps' ? 'border-sky-700 text-sky-800' : 'border-transparent text-slate-600'
              }`}
            >
              {t.navMyApps}
            </button>

            <button
              onClick={() => onSelectTab('backend-code')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-xs font-semibold cursor-pointer ${
                activeTab === 'backend-code' ? 'border-sky-700 text-sky-800' : 'border-transparent text-slate-600'
              }`}
            >
              {t.navBackendCode}
            </button>
          </nav>

          {/* ZONE 3: 1 Primary Action group (Language switcher + Distinct Login/Signup buttons) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => onLanguageChange('rw')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  currentLang === 'rw' 
                    ? 'bg-white text-slate-900 font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Soma mu Kinyarwanda"
              >
                🇷🇼 RW
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  currentLang === 'en' 
                    ? 'bg-white text-slate-900 font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Read in English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Auth CTA or User Menu */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div 
                  onClick={onOpenVendorProfile}
                  className="cursor-pointer text-right hidden sm:block hover:opacity-80 transition-opacity"
                >
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {currentUser.vendor_profile?.company_name || currentUser.full_name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {currentUser.vendor_profile?.tin_number ? `TIN: ${currentUser.vendor_profile.tin_number}` : currentUser.email}
                  </div>
                </div>

                <button
                  onClick={onOpenVendorProfile}
                  title="View / Edit Vendor Profile"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* PROMINENT SIGN IN BUTTON */}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
                >
                  {t.signIn}
                </button>

                {/* PROMINENT REGISTER / SIGNUP BUTTON */}
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
