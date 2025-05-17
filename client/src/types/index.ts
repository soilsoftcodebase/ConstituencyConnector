// Category type
export type Category = 
  | 'appointment'
  | 'startup-support'
  | 'infrastructure'
  | 'public-issue'
  | 'emergency';

// Priority type
export type Priority = 'high' | 'medium' | 'low';

// Status type
export type Status = 
  | 'new'
  | 'in-progress'
  | 'under-review'
  | 'awaiting-feedback'
  | 'resolved';

// Team member type
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  phone: string;
}

// Constituent type
export interface Constituent {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address?: string;
  district?: string;
}

// Request type
export interface Request {
  id: number;
  constituentId: number;
  category: Category;
  subject: string;
  description: string;
  status: Status;
  priority: Priority;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
  location?: string;
  attachments?: string[];
}

// Request with related data
export interface RequestWithRelations extends Request {
  constituent: Constituent;
  assignedTo: TeamMember | null;
}

// Formatted request for the dashboard
export interface DashboardRequest {
  id: number;
  constituent: {
    name: string;
    email: string;
    avatar: string;
  };
  category: Category;
  subject: string;
  date: string;
  priority: Priority;
  status: Status;
  assignedTo: {
    name: string;
    avatar: string;
  } | null;
}

// Upcoming appointment type
export interface UpcomingAppointment {
  id: number;
  constituentId: number;
  constituent: {
    name: string;
    avatar: string;
  };
  subject: string;
  date: string;
  time: string;
  isToday: boolean;
}

// Stats data for dashboard
export interface StatsData {
  totalRequests: number;
  totalRequestsChange: number;
  pendingRequests: number;
  pendingRequestsChange: number;
  completedRequests: number;
  completedRequestsChange: number;
  emergencyRequests: number;
  criticalEmergencies: number;
}

// Chart data for categories
export interface CategoryChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Chart data for status
export interface StatusChartData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

// Selected time period for dashboard
export type TimePeriod = 
  | 'today'
  | 'this-week'
  | 'this-month'
  | 'last-quarter'
  | 'this-year'
  | 'custom';

// Modal types
export type ModalType = 
  | 'request-details'
  | 'assign-request'
  | 'call-requestor'
  | 'new-request'
  | null;

// App store state
export interface AppState {
  selectedTimePeriod: TimePeriod;
  currentModal: ModalType;
  selectedRequestId: number | null;
  selectedCategory: Category | 'all';
  selectedPriority: Priority | 'all';
  selectedStatus: Status | 'all';
  searchQuery: string;
}
