export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  profile_image: string; // Stored as filename. e.g. "admin.jpg", "انبار.png", or fully qualified if needed
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface DefectReport {
  id: number;
  serialNumber: string;
  title: string;
  type: string; // e.g. "mechanical" | "electrical" | "bodywork" | "civil"
  description: string;
  reportDate: string;
  reporterName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string; // e.g. "Assembly Line A" / "Paint Shop"
  status: 'draft' | 'pending' | 'in_progress' | 'resolved';
  attachments?: string[];
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: string; // ISO date string YYYY-MM-DD
  end: string; // ISO date string YYYY-MM-DD
  description: string;
  category: 'inspection' | 'maintenance' | 'audit' | 'meeting' | 'urgent';
  color?: string;
}

export interface Notification {
  id: number;
  title: string;
  title_fa: string;
  text: string;
  text_fa: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export type Language = 'fa' | 'en';
