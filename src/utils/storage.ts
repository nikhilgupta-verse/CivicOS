import { Complaint, Status, Department } from '../types';
import { INITIAL_SEED_COMPLAINTS } from '../data/seedData';

const STORAGE_KEY = 'civicos_complaints_v1';

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_COMPLAINTS));
      return INITIAL_SEED_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_COMPLAINTS));
      return INITIAL_SEED_COMPLAINTS;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load from storage, using seed:', err);
    return INITIAL_SEED_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new CustomEvent('civicos_storage_updated', { detail: complaints }));
  } catch (err) {
    console.error('Failed to save to storage:', err);
  }
}

export function addComplaint(complaint: Complaint): void {
  const current = getStoredComplaints();
  const updated = [complaint, ...current];
  saveComplaints(updated);
}

export function updateComplaintStatus(
  id: string,
  newStatus: Status,
  updatedBy: string = 'Municipal Officer',
  note?: string
): Complaint | null {
  const current = getStoredComplaints();
  let updatedItem: Complaint | null = null;

  const updated = current.map((item) => {
    if (item.id === id) {
      const now = new Date().toISOString();
      const newHistory = [
        ...item.history,
        {
          timestamp: now,
          status: newStatus,
          updatedBy,
          note: note || `Status transitioned to ${newStatus}`,
        },
      ];

      updatedItem = {
        ...item,
        status: newStatus,
        history: newHistory,
        resolvedAt: newStatus === 'Resolved' || newStatus === 'Verified' ? item.resolvedAt || now : item.resolvedAt,
        resolutionNote: note || item.resolutionNote,
      };
      return updatedItem;
    }
    return item;
  });

  if (updatedItem) {
    saveComplaints(updated);
  }
  return updatedItem;
}

export function reassignDepartment(id: string, newDepartment: Department, officerName: string, reason?: string): Complaint | null {
  const current = getStoredComplaints();
  let updatedItem: Complaint | null = null;

  const updated = current.map((item) => {
    if (item.id === id) {
      const newHistory = [
        ...item.history,
        {
          timestamp: new Date().toISOString(),
          status: item.status,
          updatedBy: officerName || 'Municipal Admin',
          note: `Department reassigned from "${item.assignedDepartment}" to "${newDepartment}". Reason: ${reason || 'Jurisdiction realignment'}`,
        },
      ];

      updatedItem = {
        ...item,
        assignedDepartment: newDepartment,
        history: newHistory,
      };
      return updatedItem;
    }
    return item;
  });

  if (updatedItem) {
    saveComplaints(updated);
  }
  return updatedItem;
}

export function resetToSeedComplaints(): Complaint[] {
  saveComplaints(INITIAL_SEED_COMPLAINTS);
  return INITIAL_SEED_COMPLAINTS;
}
