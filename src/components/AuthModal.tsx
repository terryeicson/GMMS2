import React, { useState } from 'react';
import { User, IdType, Language } from '../types';
import { translations } from '../data/translations';
import { mockUsers } from '../data/mockUsers';
import { X, ShieldCheck, AlertCircle, CheckCircle2, User as UserIcon, Lock, Mail, Phone, CreditCard } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
  currentLang,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idType, setIdType] = useState<IdType>('national_id');
  const [identityNumber, setIdentityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick select demo account
  const handleSelectDemoAccount = (user: User) => {
    onLoginSuccess(user);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
    } else {
      // Allow dynamic login with fallback
      const newUser: User = {
        id: Date.now(),
        full_name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone_number: '+250788000000',
        id_type: 'national_id',
        national_id_or_passport: '1199580012345678',
        role: 'vendor',
        has_vendor_profile: false,
      };
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validate Rwandan National ID (Indangamuntu) 16 digits
    if (idType === 'national_id') {
      const cleanNid = identityNumber.replace(/\s+/g, '');
      if (!/^[1-3]\d{15}$/.test(cleanNid)) {
        setErrorMsg(
          currentLang === 'en'
            ? 'Rwandan National ID (Indangamuntu) must be exactly 16 numeric digits starting with 1, 2, or 3.'
            : 'Indangamuntu y\'umunyarwanda igomba kuba igizwe n\'imibare 16 gusa itangizwa na 1, 2, cyangwa 3.'
        );
        return;
      }
    } else {
      // Passport: 6-20 alphanumeric
      const cleanPassport = identityNumber.trim();
      if (!/^[A-Za-z0-9]{6,20}$/.test(cleanPassport)) {
        setErrorMsg(
          currentLang === 'en'
            ? 'Passport number must contain between 6 and 20 alphanumeric characters.'
            : 'Nimero ya pasiporo igomba kuba igizwe n\'inyuguti n\'imibare hagati ya 6 na 20.'
        );
        return;
      }
    }

    // 2. Phone format validation (+250 78/79/72/73...)
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!/^(\+?250|0)7[2389]\d{7}$/.test(cleanPhone)) {
      setErrorMsg(
        currentLang === 'en'
          ? 'Invalid phone number. Rwandan mobile numbers must follow 078/079/072/073 XXX XXXX or +250 7X XXX XXXX.'
          : 'Nimero ya telefone igomba kuba itangizwa na 078, 079, 072 cyangwa 073.'
      );
      return;
    }

    // 3. Password length & match
    if (password.length < 8) {
      setErrorMsg(
        currentLang === 'en'
          ? 'Password must be at least 8 characters long.'
          : 'Ijambobanga rigomba kuba rifite byibuze inyuguti 8.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        currentLang === 'en'
          ? 'Passwords do not match. Please re-enter.'
          : 'Amagambobanga yombi ntabwo ahuye.'
      );
      return;
    }

    // Successfully create registered user (without vendor profile initially)
    const newUser: User = {
      id: Date.now(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone_number: cleanPhone,
      id_type: idType,
      national_id_or_passport: identityNumber.trim(),
      role: 'vendor',
      has_vendor_profile: false, // New applicant must complete pre-application vendor profile
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-sky-800 border-b-2 border-sky-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.signIn}
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-sky-800 border-b-2 border-sky-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.register}
          </button>
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Address / Imeli *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. kwizera.infrastructure@rwanda.rw"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Password / Ijambobanga *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                {t.signIn}
              </button>

              {/* Fast Test / Demo Credentials Switcher */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Instant Test Accounts (Click to log in):
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount(mockUsers[0])}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200/70 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Kigali Civil Infrastructure Ltd</div>
                      <div className="text-[10px] text-slate-500 font-mono">Company · TIN: 100482931 (Road Works)</div>
                    </div>
                    <span className="text-[11px] text-sky-700 font-semibold">Select →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount(mockUsers[1])}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200/70 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Marie Chantal Mukamana</div>
                      <div className="text-[10px] text-slate-500 font-mono">Individual Trader · TIN: 108459201 (School Feeding)</div>
                    </div>
                    <span className="text-[11px] text-sky-700 font-semibold">Select →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoAccount(mockUsers[3])}
                    className="w-full text-left p-2 rounded-lg bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-amber-900 text-xs">Divine Uwase (No Profile Yet)</div>
                      <div className="text-[10px] text-amber-700">Tests mandatory pre-application vendor profile gate!</div>
                    </div>
                    <span className="text-[11px] text-amber-800 font-bold">Test Gate →</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Full Name / Amazina Yose *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jean Pierre Niyonsaba"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* ID Type Switch */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Identification Type / Ubwoko bw'Icyangombwa *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs ${
                    idType === 'national_id' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="signupIdType"
                      value="national_id"
                      checked={idType === 'national_id'}
                      onChange={() => setIdType('national_id')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>National ID (16 Digits)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs ${
                    idType === 'passport' ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold' : 'border-slate-200 text-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="signupIdType"
                      value="passport"
                      checked={idType === 'passport'}
                      onChange={() => setIdType('passport')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>Foreign Passport</span>
                  </label>
                </div>
              </div>

              {/* Identity Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {idType === 'national_id' ? 'National ID (Indangamuntu - 16 Digits) *' : 'Passport Identifier *'}
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={idType === 'national_id' ? 16 : 20}
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(idType === 'national_id' ? e.target.value.replace(/\D/g, '') : e.target.value)}
                    placeholder={idType === 'national_id' ? '1 1990 8 0012345 6 7' : 'PA9823412'}
                    className="w-full text-xs font-mono pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {idType === 'national_id'
                    ? '16 numeric digits starting with 1, 2, or 3 (Official Rwandan format).'
                    : '6 to 20 alphanumeric characters for non-Rwandan contractors.'}
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Phone Number / Telefone (+250...) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0788123456 or +250 788 123 456"
                    className="w-full text-xs font-mono pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Email Address / Imeli *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="applicant@company.rw"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Password</label>
                  <input
                    type="password"
                    min={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Confirm</label>
                  <input
                    type="password"
                    min={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors mt-2"
              >
                {t.register}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
