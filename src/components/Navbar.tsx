import React from 'react';
import { ViewMode, Language, Complaint } from '../types';
import { translations } from '../i18n/translations';
import { 
  Building2, 
  Send, 
  LayoutDashboard, 
  QrCode, 
  RotateCcw, 
  AlertCircle, 
  Languages, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  complaints: Complaint[];
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageChange,
  complaints,
  onResetData,
}) => {
  const t = translations[language];
  const activeCount = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;
  const criticalCount = complaints.filter((c) => c.aiAnalysis.severity === 'Critical' && c.status !== 'Verified').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('report')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CivicOS
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                    AI Gov
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI Operating System for Civic Governance</p>
            </div>
          </div>

          {/* Primary View Switcher Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              id="nav-citizen-portal"
              onClick={() => onViewChange('report')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'report' || currentView === 'receipt'
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.citizenPortalNav}</span>
            </button>

            <button
              id="nav-gov-dashboard"
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.govDashboardNav}</span>
              {activeCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                  currentView === 'dashboard' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {activeCount}
                </span>
              )}
            </button>

            <button
              id="nav-qr-share"
              onClick={() => onViewChange('share')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentView === 'share'
                  ? 'bg-indigo-500 text-white font-semibold shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.qrPosterNav}</span>
              <span className="md:hidden">QR</span>
            </button>
          </nav>

          {/* Right utility cluster: Language Selector + Status indicator + Reset */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <span className="text-slate-400 pl-2 pr-1 hidden lg:inline">
                <Languages className="w-3.5 h-3.5" />
              </span>
              <button
                id="lang-en"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  language === 'en' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                id="lang-hi"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  language === 'hi' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="हिन्दी (Hindi)"
              >
                हि
              </button>
              <button
                id="lang-pa"
                onClick={() => onLanguageChange('pa')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  language === 'pa' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="ਪੰਜਾਬੀ (Punjabi)"
              >
                ਪੰ
              </button>
            </div>

            {/* Critical Alert Indicator */}
            {criticalCount > 0 && (
              <div 
                onClick={() => onViewChange('dashboard')} 
                className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold cursor-pointer hover:bg-red-900/60"
                title={`${criticalCount} Critical issues requiring urgent action`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span>{criticalCount} Critical</span>
              </div>
            )}

            {/* Quick Demo Reset Data */}
            <button
              id="btn-reset-demo-data"
              onClick={onResetData}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs transition-colors"
              title="Reset to sample complaints"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
