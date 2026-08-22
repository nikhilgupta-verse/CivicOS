import React from 'react';
import { Complaint, Language } from '../types';
import { translations } from '../i18n/translations';
import { getSeverityStyle, getDepartmentColor, getStatusStyle } from '../utils/theme';
import {
  CheckCircle,
  Building2,
  Printer,
  PlusCircle,
  LayoutDashboard,
  Clock,
  MapPin,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Share2,
  FileCheck
} from 'lucide-react';

interface ConfirmationReceiptProps {
  complaint: Complaint;
  language: Language;
  onReportAnother: () => void;
  onViewDashboard: () => void;
}

export const ConfirmationReceipt: React.FC<ConfirmationReceiptProps> = ({
  complaint,
  language,
  onReportAnother,
  onViewDashboard,
}) => {
  const t = translations[language];
  const severityStyle = getSeverityStyle(complaint.aiAnalysis.severity);
  const deptColor = getDepartmentColor(complaint.assignedDepartment);
  const statusStyle = getStatusStyle(complaint.status);
  const breakdown = complaint.aiAnalysis.priority_breakdown;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Success Header Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-500/50 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.receiptTitle}
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {t.receiptSubtitle}
          </p>
        </div>

        {/* Official Civic Receipt Card */}
        <div 
          id="civic-receipt-card"
          className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative print:border-black print:bg-white print:text-black"
        >
          {/* Receipt Top Ribbon */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">CivicOS Municipal Record</span>
                <p className="text-[11px] text-slate-400 font-mono">Timestamp: {new Date(complaint.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Tracking ID Badge */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.trackingIdLabel}</span>
              <span className="font-mono font-black text-sm sm:text-base text-white tracking-wider bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                {complaint.id}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Core Issue & AI Routing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-800">
              
              {/* Issue Type & Severity */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-medium block">{t.issueTypeLabel}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-white">
                    {complaint.aiAnalysis.issue_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${severityStyle.bg}`}>
                    {complaint.aiAnalysis.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "{complaint.aiAnalysis.short_description}"
                </p>
              </div>

              {/* Assigned Department */}
              <div className="space-y-1.5 sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-xs text-slate-400 font-medium block">{t.departmentLabel}</span>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border bg-slate-800 text-teal-300 font-semibold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>{complaint.assignedDepartment}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.slaLabel}: <strong className="text-white font-mono">{complaint.aiAnalysis.estimated_resolution_time_hours} Hours</strong></span>
                </div>
              </div>

            </div>

            {/* Explainable AI Priority Score Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{t.priorityScoreLabel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold font-mono text-teal-400">
                    {complaint.aiAnalysis.priority_score}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${severityStyle.badgeBg}`}>
                    {complaint.aiAnalysis.priority_bucket}
                  </span>
                </div>
              </div>

              {/* 4-Factor Heuristic Breakdown Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hazard Severity</span>
                  <span className="text-xs font-bold font-mono text-amber-300">{breakdown.severity_score} / 40</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">School/Hospital</span>
                  <span className="text-xs font-bold font-mono text-sky-300">{breakdown.proximity_score} / 20</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Traffic Density</span>
                  <span className="text-xs font-bold font-mono text-indigo-300">{breakdown.traffic_score} / 20</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Citizen Impact</span>
                  <span className="text-xs font-bold font-mono text-teal-300">{breakdown.population_impact_score} / 20</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {breakdown.explanation}
              </p>
            </div>

            {/* Location & Identified Risk Factors */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">{complaint.location.ward}</strong>
                  <span>{complaint.location.address}</span>
                  {complaint.location.landmark && (
                    <span className="text-slate-400 block">Landmark: {complaint.location.landmark}</span>
                  )}
                </div>
              </div>

              {/* Risk Factors List */}
              {complaint.aiAnalysis.risk_factors.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                    {t.riskFactorsLabel}
                  </span>
                  <ul className="space-y-1">
                    {complaint.aiAnalysis.risk_factors.map((risk, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Field Crew Action */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <span className="font-bold text-slate-300 block mb-0.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  {t.suggestedActionLabel}
                </span>
                <p className="text-slate-300">{complaint.aiAnalysis.suggested_action}</p>
              </div>
            </div>

            {/* Attached Photo Preview if any */}
            {complaint.photoUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={complaint.photoUrl}
                  alt="Verified Civic Evidence"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
              </div>
            )}

            {/* Receipt Footer Status */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">{t.statusLabel}:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${statusStyle.badge}`}>
                  {statusStyle.label}
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                Verified Citizen Submission #CIV-{complaint.id.split('-').pop()}
              </span>
            </div>

          </div>
        </div>

        {/* Action Button Navigation Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          <button
            id="btn-report-another"
            onClick={onReportAnother}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>{t.reportAnotherBtn}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-print-receipt"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print</span>
            </button>

            <button
              id="btn-view-gov-dashboard"
              onClick={onViewDashboard}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.viewDashboardBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
