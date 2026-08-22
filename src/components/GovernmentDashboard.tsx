import React, { useState, useMemo } from 'react';
import { Complaint, Department, IssueType, SeverityLevel, Status } from '../types';
import { MUNICIPAL_WARDS } from '../data/seedData';
import { getSeverityStyle, getStatusStyle, getDepartmentColor } from '../utils/theme';
import { CivicMapVisualizer } from './CivicMapVisualizer';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Droplet,
  Lightbulb,
  Trash2,
  Car,
  Workflow,
  Eye,
  Map as MapIcon,
  ListFilter
} from 'lucide-react';

interface GovernmentDashboardProps {
  complaints: Complaint[];
  onComplaintUpdated: (updated: Complaint) => void;
  onSwitchToCitizenPortal: () => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  complaints,
  onComplaintUpdated,
  onSwitchToCitizenPortal,
}) => {
  // Filter States
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'map'>('table');

  // Selected complaint for modal detail inspection
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filtered complaints calculation
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // Ward filter
      if (selectedWard !== 'all' && item.location.ward !== selectedWard) {
        return false;
      }
      // Department filter
      if (selectedDept !== 'all' && item.assignedDepartment !== selectedDept) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'all' && item.aiAnalysis.severity !== selectedSeverity) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = item.id.toLowerCase().includes(query);
        const matchType = item.aiAnalysis.issue_type.toLowerCase().includes(query);
        const matchDesc = item.rawDescription.toLowerCase().includes(query);
        const matchAddress = item.location.address.toLowerCase().includes(query);
        const matchDept = item.assignedDepartment.toLowerCase().includes(query);
        if (!matchId && !matchType && !matchDesc && !matchAddress && !matchDept) {
          return false;
        }
      }
      return true;
    });
  }, [complaints, selectedWard, selectedDept, selectedStatus, selectedSeverity, searchQuery]);

  // Overall metric aggregations
  const stats = useMemo(() => {
    const active = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress');
    const totalCount = complaints.length;
    const activeCount = active.length;
    const resolvedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Verified').length;

    // Issue Category Counts
    const potholes = complaints.filter((c) => c.aiAnalysis.issue_type === 'Pothole').length;
    const garbage = complaints.filter((c) => c.aiAnalysis.issue_type === 'Garbage & Waste').length;
    const streetlights = complaints.filter((c) => c.aiAnalysis.issue_type === 'Broken Streetlight').length;
    const water = complaints.filter((c) => c.aiAnalysis.issue_type === 'Water Leakage').length;
    const drains = complaints.filter((c) => c.aiAnalysis.issue_type === 'Blocked Drain').length;
    const traffic = complaints.filter((c) => c.aiAnalysis.issue_type === 'Damaged Traffic Signal').length;
    const other = complaints.filter((c) => c.aiAnalysis.issue_type === 'Damaged Public Infrastructure' || c.aiAnalysis.issue_type === 'Other').length;

    // Priority breakdown
    const critical = complaints.filter((c) => c.aiAnalysis.severity === 'Critical').length;
    const high = complaints.filter((c) => c.aiAnalysis.severity === 'High').length;
    const medium = complaints.filter((c) => c.aiAnalysis.severity === 'Medium').length;
    const low = complaints.filter((c) => c.aiAnalysis.severity === 'Low').length;

    return {
      totalCount,
      activeCount,
      resolvedCount,
      potholes,
      garbage,
      streetlights,
      water,
      drains,
      traffic,
      other,
      critical,
      high,
      medium,
      low,
    };
  }, [complaints]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Executive Header with Live Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Municipal Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CivicOS Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              AI-triaged complaints routing, SLA monitoring, and inter-departmental dispatch control.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right pr-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Active Issues</span>
              <span className="text-2xl font-black font-mono text-amber-400">{stats.activeCount}</span>
            </div>

            <div className="text-right pr-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical Urgent</span>
              <span className="text-2xl font-black font-mono text-red-500 animate-pulse">{stats.critical}</span>
            </div>

            <button
              onClick={onSwitchToCitizenPortal}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Citizen Report</span>
            </button>
          </div>
        </div>

        {/* 1. Category Metric Card Widgets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Potholes Card */}
          <div 
            onClick={() => setSearchQuery('pothole')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span className="font-semibold">Potholes</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.potholes}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Roads Dept</div>
          </div>

          {/* Garbage Card */}
          <div 
            onClick={() => setSearchQuery('garbage')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
              <span className="font-semibold">Garbage</span>
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.garbage}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sanitation Dept</div>
          </div>

          {/* Streetlights Card */}
          <div 
            onClick={() => setSearchQuery('streetlight')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-indigo-400 mb-1">
              <span className="font-semibold">Streetlights</span>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.streetlights}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Electrical Dept</div>
          </div>

          {/* Water Leakage Card */}
          <div 
            onClick={() => setSearchQuery('water')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-sky-400 mb-1">
              <span className="font-semibold">Water Supply</span>
              <Droplet className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.water}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Water Board</div>
          </div>

          {/* Drainage Card */}
          <div 
            onClick={() => setSearchQuery('drain')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-teal-400 mb-1">
              <span className="font-semibold">Drainage</span>
              <Workflow className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.drains}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Drainage Dept</div>
          </div>

          {/* Traffic / Other Card */}
          <div 
            onClick={() => setSearchQuery('')} 
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
              <span className="font-semibold">Traffic & Other</span>
              <Car className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white">{stats.traffic + stats.other}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Traffic & Public Works</div>
          </div>

        </div>

        {/* 2. Priority Breakdown & Heuristic Distribution Bar Chart */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>AI Priority Distribution & Triage Buckets</span>
              </h3>
              <p className="text-xs text-slate-400">
                Calculated from multimodal severity (40%), school/hospital proximity (20%), road traffic (20%), and population impact (20%).
              </p>
            </div>

            {/* Quick Priority Filter Pills */}
            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setSelectedSeverity(selectedSeverity === 'Critical' ? 'all' : 'Critical')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedSeverity === 'Critical' ? 'bg-red-600 text-white' : 'bg-red-950/60 text-red-300 hover:bg-red-900/80'
                }`}
              >
                Critical: {stats.critical}
              </button>
              <button
                onClick={() => setSelectedSeverity(selectedSeverity === 'High' ? 'all' : 'High')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedSeverity === 'High' ? 'bg-orange-600 text-white' : 'bg-orange-950/60 text-orange-300 hover:bg-orange-900/80'
                }`}
              >
                High: {stats.high}
              </button>
              <button
                onClick={() => setSelectedSeverity(selectedSeverity === 'Medium' ? 'all' : 'Medium')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedSeverity === 'Medium' ? 'bg-amber-600 text-white' : 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/80'
                }`}
              >
                Medium: {stats.medium}
              </button>
              <button
                onClick={() => setSelectedSeverity(selectedSeverity === 'Low' ? 'all' : 'Low')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedSeverity === 'Low' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80'
                }`}
              >
                Low: {stats.low}
              </button>
            </div>
          </div>

          {/* Visual Horizontal Segmented Distribution Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 rounded-full bg-slate-950 flex overflow-hidden p-0.5 border border-slate-800">
              {stats.critical > 0 && (
                <div
                  style={{ width: `${(stats.critical / stats.totalCount) * 100}%` }}
                  className="h-full bg-red-500 rounded-l-full transition-all"
                  title={`Critical: ${stats.critical}`}
                />
              )}
              {stats.high > 0 && (
                <div
                  style={{ width: `${(stats.high / stats.totalCount) * 100}%` }}
                  className="h-full bg-orange-500 transition-all"
                  title={`High: ${stats.high}`}
                />
              )}
              {stats.medium > 0 && (
                <div
                  style={{ width: `${(stats.medium / stats.totalCount) * 100}%` }}
                  className="h-full bg-amber-500 transition-all"
                  title={`Medium: ${stats.medium}`}
                />
              )}
              {stats.low > 0 && (
                <div
                  style={{ width: `${(stats.low / stats.totalCount) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-r-full transition-all"
                  title={`Low: ${stats.low}`}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Critical (Score 80-100) — SLA: 4h
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                High (Score 60-79) — SLA: 12h
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Medium (Score 35-59) — SLA: 24h
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Low (Score &lt;35) — SLA: 48h
              </span>
            </div>
          </div>
        </div>

        {/* 3. Filter Controls & Search Bar */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, street, landmark, or department..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Mode Toggle: Table vs Map */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                id="btn-view-table"
                onClick={() => setActiveTab('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'table' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Complaints Table</span>
              </button>
              <button
                id="btn-view-map"
                onClick={() => setActiveTab('map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'map' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Ward Density Map</span>
              </button>
            </div>
          </div>

          {/* Ward, Department, Status Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            
            {/* Ward-wise / Zone-wise Dropdown */}
            <div>
              <label htmlFor="filter-ward" className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" />
                Ward / Municipal Zone Filter:
              </label>
              <select
                id="filter-ward"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:ring-2 focus:ring-sky-500"
              >
                {MUNICIPAL_WARDS.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="filter-department" className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-400" />
                Department Filter:
              </label>
              <select
                id="filter-department"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Departments</option>
                <option value="Roads Department">Roads Department</option>
                <option value="Sanitation Department">Sanitation Department</option>
                <option value="Electrical Department">Electrical Department</option>
                <option value="Water Supply Department">Water Supply Department</option>
                <option value="Drainage Department">Drainage Department</option>
                <option value="Traffic Department">Traffic Department</option>
                <option value="Public Works">Public Works</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="filter-status" className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-400" />
                Resolution Status Filter:
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Statuses (Active & Resolved)</option>
                <option value="Open">Open (Pending Field Action)</option>
                <option value="In Progress">In Progress (Crew on Site)</option>
                <option value="Resolved">Resolved (Completed)</option>
                <option value="Verified">Verified (Citizen Audited)</option>
              </select>
            </div>

          </div>

        </div>

        {/* 4. Tab Content: Table View vs Map Visualizer */}
        {activeTab === 'map' ? (
          <CivicMapVisualizer
            complaints={filteredComplaints}
            selectedWard={selectedWard}
            onSelectComplaint={(complaint) => setSelectedComplaint(complaint)}
          />
        ) : (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="px-6 py-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Displaying <strong className="text-white font-mono">{filteredComplaints.length}</strong> of {complaints.length} municipal complaints
              </span>

              {(selectedWard !== 'all' || selectedDept !== 'all' || selectedStatus !== 'all' || selectedSeverity !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedWard('all');
                    setSelectedDept('all');
                    setSelectedStatus('all');
                    setSelectedSeverity('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Complaints Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Issue Type & Summary</th>
                    <th className="py-3 px-4">Priority / Severity</th>
                    <th className="py-3 px-4">Assigned Department</th>
                    <th className="py-3 px-4">Ward & Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto space-y-2">
                          <AlertCircleIcon className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-semibold text-slate-400">No complaints matching the active filter criteria.</p>
                          <p className="text-xs text-slate-500">Try adjusting your ward or search query.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item) => {
                      const severityStyle = getSeverityStyle(item.aiAnalysis.severity);
                      const statusStyle = getStatusStyle(item.status);

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                          onClick={() => setSelectedComplaint(item)}
                        >
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-teal-300">
                            {item.id}
                          </td>

                          {/* Issue Type */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white group-hover:text-sky-300 transition-colors">
                              {item.aiAnalysis.issue_type}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {item.aiAnalysis.short_description}
                            </p>
                          </td>

                          {/* Severity & Score */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase border ${severityStyle.bg}`}>
                                {item.aiAnalysis.severity}
                              </span>
                              <span className="font-mono font-bold text-slate-300 text-xs">
                                {item.aiAnalysis.priority_score}
                              </span>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-1 rounded-lg bg-slate-800 text-teal-300 text-[11px] font-medium border border-slate-700">
                              {item.assignedDepartment}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-200 line-clamp-1">{item.location.ward}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{item.location.address}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusStyle.badge}`}>
                              {item.status}
                            </span>
                          </td>

                          {/* Time */}
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`inspect-btn-${item.id}`}
                              onClick={() => setSelectedComplaint(item)}
                              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-400 text-xs font-semibold border border-slate-700 transition-all"
                            >
                              Inspect & Action
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Modal Inspector Detail Panel */}
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onComplaintUpdated={(updated) => {
              setSelectedComplaint(updated);
              onComplaintUpdated(updated);
            }}
          />
        )}

      </div>
    </div>
  );
};

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
