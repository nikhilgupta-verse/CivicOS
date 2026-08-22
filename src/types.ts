export type Language = 'en' | 'hi' | 'pa';

export type IssueType =
  | 'Pothole'
  | 'Garbage & Waste'
  | 'Broken Streetlight'
  | 'Water Leakage'
  | 'Blocked Drain'
  | 'Damaged Traffic Signal'
  | 'Damaged Public Infrastructure'
  | 'Other';

export type Department =
  | 'Roads Department'
  | 'Sanitation Department'
  | 'Electrical Department'
  | 'Water Supply Department'
  | 'Drainage Department'
  | 'Traffic Department'
  | 'Public Works';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Verified';

export interface PriorityBreakdown {
  severity_score: number; // max 40
  proximity_score: number; // max 20 (schools/hospitals)
  traffic_score: number; // max 20 (arterial roads/intersections)
  population_impact_score: number; // max 20 (daily commuters)
  total: number; // 0-100
  explanation: string;
}

export interface AIAnalysisResult {
  issue_type: IssueType;
  severity: SeverityLevel;
  short_description: string;
  suggested_department: Department;
  risk_factors: string[];
  detected_language: string;
  priority_score: number;
  priority_bucket: SeverityLevel;
  priority_breakdown: PriorityBreakdown;
  estimated_resolution_time_hours: number;
  suggested_action: string;
}

export interface ComplaintLocation {
  address: string;
  ward: string; // e.g. "Ward 12 - Civil Lines"
  zone: string; // e.g. "North Zone"
  latitude?: number;
  longitude?: number;
  landmark?: string;
}

export interface StatusUpdateLog {
  timestamp: string;
  status: Status;
  updatedBy: string;
  note?: string;
}

export interface Complaint {
  id: string; // e.g. "CIV-2026-8942"
  createdAt: string; // ISO date
  citizenLanguage: Language;
  rawDescription: string;
  photoUrl?: string; // base64 or sample asset
  location: ComplaintLocation;
  aiAnalysis: AIAnalysisResult;
  status: Status;
  assignedDepartment: Department;
  assignedCrew?: string;
  resolutionPhotoUrl?: string;
  resolutionNote?: string;
  resolvedAt?: string;
  history: StatusUpdateLog[];
  source: 'web_portal' | 'qr_scan' | 'citizen_app';
}

export type ViewMode = 'report' | 'dashboard' | 'share' | 'receipt';
