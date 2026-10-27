/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tender, Application, User, VendorProfile, Language } from './types';
import { initialTenders } from './data/initialTenders';
import { mockUsers } from './data/mockUsers';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { TenderList } from './components/TenderList';
import { TenderDetailsModal } from './components/TenderDetailsModal';
import { VendorProfileModal } from './components/VendorProfileModal';
import { ApplyTenderModal } from './components/ApplyTenderModal';
import { SubmissionReceiptModal } from './components/SubmissionReceiptModal';
import { MyApplicationsView } from './components/MyApplicationsView';
import { AuthModal } from './components/AuthModal';
import { BackendCodeViewer } from './components/BackendCodeViewer';
import { CheckCircle2, AlertTriangle, X, Shield, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gmms_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockUsers[0];
      }
    }
    return mockUsers[0]; // Default to Company Contractor for rich preview
  });

  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('gmms_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 1,
        application_tracking_code: 'RW-TND-2026-8812',
        tender_id: 2,
        tender: initialTenders[1],
        user_id: 2,
        vendor_profile: mockUsers[1].vendor_profile!,
        applicant_name: 'Mukamana Agri-Trade & Distribution',
        applicant_email: 'chantal.mukamana@gmail.com',
        applicant_phone: '+250788987654',
        financial_offer_rwf: 268500000,
        proposed_delivery_days: 45,
        technical_proposal_summary: 'Comprehensive delivery matrix using 3 refrigerated trucks and direct farmer aggregator storage hubs in Bugesera. 100% fortified grain sourced from Eastern Province farmers.',
        anti_corruption_pledge_signed: true,
        status: 'administrative_review',
        submitted_at: '2026-10-21 09:40:12',
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'tenders' | 'my-apps' | 'backend-code'>('home');
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<string>('all');
  
  // Modals state
  const [selectedTenderForDetails, setSelectedTenderForDetails] = useState<Tender | null>(null);
  const [selectedTenderForApply, setSelectedTenderForApply] = useState<Tender | null>(null);
  const [isVendorProfileModalOpen, setIsVendorProfileModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [activeReceipt, setActiveReceipt] = useState<Application | null>(null);

  // Global notification banner
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning';
    msgEn: string;
    msgRw: string;
  } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gmms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gmms_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gmms_applications', JSON.stringify(applications));
  }, [applications]);

  const showToast = (type: 'success' | 'error' | 'warning', msgEn: string, msgRw: string) => {
    setToast({ type, msgEn, msgRw });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PRE-APPLICATION VENDOR PROFILE GATEKEEPER ---
  const handleInitiateApply = (tender: Tender) => {
    // 1. Check if user is logged in
    if (!currentUser) {
      showToast(
        'warning',
        'Authentication Required: Please sign in or register to apply for government markets.',
        'Kwinjira Birakenewe: Nyamuneka banza winjire cyangwa wiyandikishe kugira ngo usabe amasoko ya Leta.'
      );
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    // 2. MANDATORY CHECK: Does the user have a completed Vendor Profile?
    if (!currentUser.has_vendor_profile || !currentUser.vendor_profile) {
      showToast(
        'warning',
        'Pre-Application Requirement: Under RPPA regulations, you must complete your Vendor Profile (Business type, TIN, category, experience) before bidding.',
        'Ibisabwa Mbere yo Gusaba: Dukurikije amategeko ya RPPA, ugomba kubanza kuzuza Umwirondoro w\'Ubucuruzi (TIN, icyiciro, uburambe) mbere yo gupiganwa.'
      );
      setIsVendorProfileModalOpen(true);
      return;
    }

    // 3. Prevent duplicate application for the same tender
    const alreadyApplied = applications.find(
      (a) => a.user_id === currentUser.id && a.tender_id === tender.id
    );
    if (alreadyApplied) {
      showToast(
        'warning',
        `Duplicate Application: You have already submitted a bid for this tender (Tracking Code: ${alreadyApplied.application_tracking_code}).`,
        `Wamaze Gusaba Iri Soko: Idosiye yawe yaramaze kwakirwa (Nimero: ${alreadyApplied.application_tracking_code}).`
      );
      setActiveReceipt(alreadyApplied);
      return;
    }

    // 4. Open apply modal
    setSelectedTenderForApply(tender);
  };

  const handleSaveVendorProfile = (updatedProfile: VendorProfile) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      has_vendor_profile: true,
      vendor_profile: updatedProfile,
    };
    setCurrentUser(updatedUser);
    showToast(
      'success',
      'Vendor Profile saved successfully! You are now fully qualified to submit bids across all government markets.',
      'Umwirondoro w\'ubucuruzi wabitswe neza! Ubu wemerewe gupiganira amasoko yose ya Leta.'
    );
  };

  const handleSubmitApplication = (
    appData: Omit<Application, 'id' | 'application_tracking_code' | 'submitted_at' | 'status'>
  ) => {
    // Generate official Rwandan Application Tracking Code
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const trackingCode = `RW-TND-${year}-${randomHex}`;

    const newApplication: Application = {
      ...appData,
      id: Date.now(),
      application_tracking_code: trackingCode,
      status: 'submitted',
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setApplications((prev) => [newApplication, ...prev]);
    setSelectedTenderForApply(null);

    showToast(
      'success',
      `Tender bid officially recorded! Tracking Reference: ${trackingCode}.`,
      `Gusaba isoko byakiriwe neza! Nimero y'idosiye yawe: ${trackingCode}.`
    );

    // Open official submission receipt
    setActiveReceipt(newApplication);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(
      'success',
      `Welcome back, ${user.full_name}! Authenticated via National Registry.`,
      `Murakaza neza, ${user.full_name}! Mwinjiye neza muri sisitemu y'amasoko.`
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast(
      'success',
      'You have been signed out safely from GMMS Rwanda.',
      'Mwasohotse mu mutekano muri sisitemu ya GMMS Rwanda.'
    );
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Official Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenVendorProfile={() => {
          if (!currentUser) {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          } else {
            setIsVendorProfileModalOpen(true);
          }
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Global Notification Banner */}
      {toast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full animate-in fade-in slide-in-from-top-2 duration-150">
          <div
            className={`p-4 rounded-xl border flex items-start justify-between shadow-2xs text-xs ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : toast.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold">
                  {currentLang === 'en' ? toast.msgEn : toast.msgRw}
                </div>
                <div className="text-[11px] opacity-80">
                  {currentLang === 'en' ? toast.msgRw : toast.msgEn}
                </div>
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'home' && (
          <HomePage
            currentLang={currentLang}
            currentUser={currentUser}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
            onOpenVendorProfile={() => {
              if (!currentUser) {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              } else {
                setIsVendorProfileModalOpen(true);
              }
            }}
            onNavigateToTenders={(category) => {
              if (category) {
                setInitialCategoryFilter(category);
              } else {
                setInitialCategoryFilter('all');
              }
              setActiveTab('tenders');
            }}
            tenders={tenders}
          />
        )}

        {activeTab === 'tenders' && (
          <TenderList
            tenders={tenders}
            currentLang={currentLang}
            currentUser={currentUser}
            selectedCategoryProp={initialCategoryFilter}
            onSelectTender={setSelectedTenderForDetails}
            onApplyTender={handleInitiateApply}
            onOpenVendorProfile={() => {
              if (!currentUser) {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              } else {
                setIsVendorProfileModalOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'my-apps' && (
          <MyApplicationsView
            applications={applications.filter((a) => !currentUser || a.user_id === currentUser.id)}
            currentLang={currentLang}
            onViewReceipt={setActiveReceipt}
            onBrowseTenders={() => {
              setInitialCategoryFilter('all');
              setActiveTab('tenders');
            }}
          />
        )}

        {activeTab === 'backend-code' && (
          <BackendCodeViewer currentLang={currentLang} />
        )}
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sky-800 text-sm">
                🇷🇼
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  Rwanda Public Procurement Authority (RPPA)
                </div>
                <div className="text-[11px] text-slate-400">
                  Republic of Rwanda · E-Procurement Directorate
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <span className="font-mono text-[11px]">Toll-Free Helpline: 3029 (Rwanda)</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-[11px]">+250 788 123 456</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>info@rppa.gov.rw</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Republic of Rwanda. All rights reserved. Built to Vision 2050 standards.
            </div>
            <div className="flex items-center gap-4">
              <span>Law N° 62/2018 on Public Procurement</span>
              <span aria-hidden="true">·</span>
              <span>KN 3 Ave, Kigali</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <TenderDetailsModal
        tender={selectedTenderForDetails}
        currentLang={currentLang}
        onClose={() => setSelectedTenderForDetails(null)}
        onApply={handleInitiateApply}
      />

      <VendorProfileModal
        isOpen={isVendorProfileModalOpen}
        onClose={() => setIsVendorProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveVendorProfile}
        currentLang={currentLang}
      />

      {currentUser && (
        <ApplyTenderModal
          tender={selectedTenderForApply}
          currentUser={currentUser}
          currentLang={currentLang}
          onClose={() => setSelectedTenderForApply(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      <SubmissionReceiptModal
        application={activeReceipt}
        currentLang={currentLang}
        onClose={() => setActiveReceipt(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
      />
    </div>
  );
}
