import React, { useState } from 'react';
import { Complaint, Status, Department } from '../types';
import { getSeverityStyle, getDepartmentColor, getStatusStyle } from '../utils/theme';
import { updateComplaintStatus, reassignDepartment } from '../utils/storage';
import {
  X,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  FileText,
  Activity,
  Zap,
  RotateCw,
  ExternalLink,
  MessageSquarePlus,
  Send
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onComplaintUpdated: (updated: Complaint) => void;
}

const ALL_DEPARTMENTS: Department[] = [
  'Roads Department',
  'Sanitation Department',
  'Electrical Department',
  'Water Supply Department',
  'Drainage Department',
  'Traffic Department',
  'Public Works',
];

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onComplaintUpdated,
}) => {
  const severityStyle = getSeverityStyle(complaint.aiAnalysis.severity);
  const statusStyle = getStatusStyle(complaint.status);
  const breakdown = complaint.aiAnalysis.priority_breakdown;

  const [officerName, setOfficerName] = useState<string>('Officer S. Mehra (Zone Control)');
  const [actionNote, setActionNote] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<Department>(complaint.assignedDepartment);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showReassign, setShowReassign] = useState<boolean>(false);

  // Status progression action
  const handleStatusChange = (newStatus: Status) => {
    setIsUpdating(true);
    const updated = updateComplaintStatus(
      complaint.id,
      newStatus,
      officerName,
      actionNote.trim() || `Status moved to ${newStatus} by ${officerName}`
    );
    if (updated) {
      onComplaintUpdated(updated);
      setActionNote('');
    }
    setIsUpdating(false);
  };

  // Reassign department
  const handleReassign = () => {
    if (selectedDept === complaint.assignedDepartment) return;
    setIsUpdating(true);
    const updated = reassignDepartment(
      complaint.id,
      selectedDept,
      officerName,
      actionNote.trim() || 'Official reassignment to relevant departmental unit.'
    );
    if (updated) {
      onComplaintUpdated(updated);
      setShowReassign(false);
      setActionNote('');
    }
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-150 text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Navigation Bar */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-teal-300 border border-slate-700">
              {complaint.id}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${severityStyle.badgeBg}`}>
                {complaint.aiAnalysis.severity} ({complaint.aiAnalysis.priority_score}/100)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.badge}`}>
                {complaint.status}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Info Grid: Photo + AI Classification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Photo and Location */}
            <div className="lg:col-span-5 space-y-3">
              {complaint.photoUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                  <img
                    src={complaint.photoUrl}
                    alt="Civic Issue Evidence"
                    referrerPolicy="no-referrer"
                    className="w-full h-56 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                  No Photo Attached (Text Report)
                </div>
              )}

              {/* Location Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{complaint.location.ward}</span>
                </div>
                <p className="text-slate-400">{complaint.location.address}</p>
                {complaint.location.landmark && (
                  <p className="text-teal-400 text-[11px]">Landmark: {complaint.location.landmark}</p>
                )}
                <p className="text-[10px] text-slate-500 font-mono">
                  Coordinates: {complaint.location.latitude?.toFixed(4)}, {complaint.location.longitude?.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Right: AI Understanding & Heuristic Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Classification Banner */}
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold text-teal-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini AI Multimodal Classification
                </span>
                <h3 className="text-lg font-bold text-white">
                  {complaint.aiAnalysis.issue_type}
                </h3>
                <p className="text-xs text-slate-300">
                  {complaint.aiAnalysis.short_description}
                </p>
              </div>

              {/* Raw Citizen Text */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Original Citizen Report ({complaint.aiAnalysis.detected_language || 'English'}):
                </span>
                <p className="text-xs text-slate-200 italic">
                  "{complaint.rawDescription}"
                </p>
              </div>

              {/* 4-Factor Heuristic Score Details */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Priority Heuristic Index</span>
                  <span className="font-mono text-teal-400 text-sm font-black">
                    {complaint.aiAnalysis.priority_score} / 100
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Severity</span>
                    <strong className="text-amber-300 font-mono">{breakdown.severity_score}/40</strong>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Proximity</span>
                    <strong className="text-sky-300 font-mono">{breakdown.proximity_score}/20</strong>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Traffic</span>
                    <strong className="text-indigo-300 font-mono">{breakdown.traffic_score}/20</strong>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Impact</span>
                    <strong className="text-teal-300 font-mono">{breakdown.population_impact_score}/20</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {breakdown.explanation}
                </p>
              </div>

              {/* Department & SLA */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Assigned Department</span>
                  <strong className="text-teal-300 font-semibold text-sm">{complaint.assignedDepartment}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Target SLA</span>
                  <strong className="text-white font-mono">{complaint.aiAnalysis.estimated_resolution_time_hours} Hours</strong>
                </div>
              </div>

            </div>

          </div>

          {/* Risk Factors & Crew Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Risk Factors */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Detected Hazard Risk Factors
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {complaint.aiAnalysis.risk_factors.map((rf, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crew Action Order */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                AI Dispatch Recommendation
              </span>
              <p className="text-xs text-slate-300">
                {complaint.aiAnalysis.suggested_action}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Field Crew:</span>
                <span className="text-white font-medium">{complaint.assignedCrew || 'Municipal Response Unit'}</span>
              </div>
            </div>

          </div>

          {/* Department Reassignment Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Department Routing & Crew Control
              </span>
              <button
                type="button"
                onClick={() => setShowReassign(!showReassign)}
                className="text-xs text-teal-400 hover:text-teal-300 underline font-medium"
              >
                {showReassign ? 'Cancel Reassignment' : 'Reassign to Another Department'}
              </button>
            </div>

            {showReassign && (
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as Department)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-teal-500"
                >
                  {ALL_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleReassign}
                  disabled={isUpdating || selectedDept === complaint.assignedDepartment}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Confirm Reassignment
                </button>
              </div>
            )}
          </div>

          {/* Officer Action & Status Progression Form */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-700/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-400" />
                Update Complaint Workflow Status
              </span>
              <span className="text-xs text-slate-400">Step: {complaint.status}</span>
            </div>

            {/* Officer Name & Action Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Municipal Officer / Inspector</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Work Order / Inspection Note</label>
                <input
                  type="text"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Dispatched pothole cold-mix repair van #4 with supervisor."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Workflow Step Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleStatusChange('Open')}
                disabled={complaint.status === 'Open' || isUpdating}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  complaint.status === 'Open'
                    ? 'bg-red-500 text-white ring-2 ring-red-400 cursor-default'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                1. Re-Open
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('In Progress')}
                disabled={complaint.status === 'In Progress' || isUpdating}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  complaint.status === 'In Progress'
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 cursor-default'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                2. Mark In Progress
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Resolved')}
                disabled={complaint.status === 'Resolved' || isUpdating}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  complaint.status === 'Resolved'
                    ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 cursor-default'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                3. Mark Resolved
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Verified')}
                disabled={complaint.status === 'Verified' || isUpdating}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  complaint.status === 'Verified'
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 cursor-default'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                4. Citizen Verify
              </button>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Municipal Audit History Log
            </span>
            <div className="space-y-2 border-l-2 border-slate-800 pl-4">
              {complaint.history.map((h, i) => (
                <div key={i} className="relative text-xs space-y-0.5 pb-2">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{h.updatedBy}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(h.timestamp).toLocaleTimeString()} · {new Date(h.timestamp).toLocaleDateString()}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-teal-300 border border-slate-700">
                      {h.status}
                    </span>
                  </div>
                  {h.note && <p className="text-slate-400 text-xs">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Close */}
        <div className="px-6 py-3.5 bg-slate-850 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
