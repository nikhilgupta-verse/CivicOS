import React, { useState, useEffect } from 'react';
import { ViewMode, Language, Complaint } from './types';
import { getStoredComplaints, resetToSeedComplaints, saveComplaints } from './utils/storage';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './components/CitizenPortal';
import { ConfirmationReceipt } from './components/ConfirmationReceipt';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { QrShareView } from './components/QrShareView';

export default function App() {
  // Routing & View State
  const [currentView, setCurrentView] = useState<ViewMode>('report');
  const [language, setLanguage] = useState<Language>('en');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [lastSubmittedComplaint, setLastSubmittedComplaint] = useState<Complaint | null>(null);

  // Initialize from URL params or pathname
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view') as ViewMode | null;
    const path = window.location.pathname;

    if (viewParam && ['report', 'dashboard', 'share', 'receipt'].includes(viewParam)) {
      setCurrentView(viewParam);
    } else if (path.includes('/dashboard')) {
      setCurrentView('dashboard');
    } else if (path.includes('/share')) {
      setCurrentView('share');
    } else {
      setCurrentView('report');
    }

    // Load initial complaints
    const initial = getStoredComplaints();
    setComplaints(initial);

    // Load language preference
    const savedLang = localStorage.getItem('civicos_lang') as Language | null;
    if (savedLang && ['en', 'hi', 'pa'].includes(savedLang)) {
      setLanguage(savedLang);
    }

    // Storage update event listener
    const handleStorageChange = (e: any) => {
      if (e.detail) {
        setComplaints(e.detail);
      }
    };
    window.addEventListener('civicos_storage_updated', handleStorageChange);
    return () => window.removeEventListener('civicos_storage_updated', handleStorageChange);
  }, []);

  // Update view and history state
  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('view', view);
    window.history.pushState({}, '', newUrl.toString());
  };

  // Change Language
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('civicos_lang', newLang);
  };

  // Handle complaint submission
  const handleComplaintSubmitted = (complaint: Complaint) => {
    setLastSubmittedComplaint(complaint);
    setCurrentView('receipt');
  };

  // Handle complaint update in dashboard
  const handleComplaintUpdated = (updated: Complaint) => {
    setComplaints((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Reset to seed data
  const handleResetData = () => {
    if (window.confirm('Reset all complaints to default sample municipal seed data?')) {
      const resetList = resetToSeedComplaints();
      setComplaints(resetList);
      if (currentView === 'receipt') {
        setCurrentView('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-slate-950">
      
      {/* Sticky Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        complaints={complaints}
        onResetData={handleResetData}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'report' && (
          <CitizenPortal
            language={language}
            onLanguageChange={handleLanguageChange}
            onComplaintSubmitted={handleComplaintSubmitted}
            onSwitchToDashboard={() => handleViewChange('dashboard')}
          />
        )}

        {currentView === 'receipt' && (
          <ConfirmationReceipt
            complaint={lastSubmittedComplaint || complaints[0]}
            language={language}
            onReportAnother={() => handleViewChange('report')}
            onViewDashboard={() => handleViewChange('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <GovernmentDashboard
            complaints={complaints}
            onComplaintUpdated={handleComplaintUpdated}
            onSwitchToCitizenPortal={() => handleViewChange('report')}
          />
        )}

        {currentView === 'share' && (
          <QrShareView
            onSwitchToCitizenPortal={() => handleViewChange('report')}
          />
        )}
      </main>

      {/* Municipal Footer Ribbon */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="font-semibold text-slate-400">CivicOS AI Governance Suite</span>
            <span>· REPORT → UNDERSTAND → PRIORITIZE → ROUTE → RESOLVE → VERIFY</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Powered by Gemini 3.7 Flash Multimodal</span>
            <span>·</span>
            <span>Municipal Service Level Guarantee</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
