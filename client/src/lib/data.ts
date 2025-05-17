import { 
  Category, 
  DashboardRequest, 
  RequestWithRelations, 
  Priority, 
  Status, 
  TeamMember, 
  Constituent,
  StatsData,
  CategoryChartData,
  StatusChartData,
  UpcomingAppointment,
  AppState
} from '@/types';

// Reusable function to format a category name
export const formatCategory = (category: Category): string => {
  switch(category) {
    case 'appointment': return 'Appointment';
    case 'startup-support': return 'Startup Support';
    case 'infrastructure': return 'Infrastructure';
    case 'public-issue': return 'Public Issue';
    case 'emergency': return 'Emergency';
    default: return category;
  }
};

// Reusable function to format status name
export const formatStatus = (status: Status): string => {
  switch(status) {
    case 'in-progress': return 'In Progress';
    case 'under-review': return 'Under Review';
    case 'awaiting-feedback': return 'Awaiting Feedback';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Get CSS class for category badge
export const getCategoryBadgeClass = (category: Category): string => {
  switch(category) {
    case 'appointment': return 'badge-appointment';
    case 'startup-support': return 'badge-startup';
    case 'infrastructure': return 'badge-infrastructure';
    case 'public-issue': return 'badge-public';
    case 'emergency': return 'badge-emergency';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get CSS class for priority badge
export const getPriorityBadgeClass = (priority: Priority): string => {
  switch(priority) {
    case 'high': return 'badge-high';
    case 'medium': return 'badge-medium';
    case 'low': return 'badge-low';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get CSS class for status badge
export const getStatusBadgeClass = (status: Status): string => {
  switch(status) {
    case 'new': return 'badge-new';
    case 'in-progress': return 'badge-in-progress';
    case 'under-review': return 'badge-under-review';
    case 'awaiting-feedback': return 'badge-awaiting-feedback';
    case 'resolved': return 'badge-resolved';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get appropriate icon for category
export const getCategoryIcon = (category: Category): string => {
  switch(category) {
    case 'appointment': return 'UserCheck';
    case 'startup-support': return 'Package2';
    case 'infrastructure': return 'Road';
    case 'public-issue': return 'Users';
    case 'emergency': return 'AlertTriangle';
    default: return 'File';
  }
};

// Filter requests based on category
export const filterRequestsByCategory = (requests: DashboardRequest[], category: Category): DashboardRequest[] => {
  return requests.filter(request => request.category === category);
};

// Get color for category
export const getCategoryColor = (category: Category): string => {
  switch(category) {
    case 'appointment': return 'hsl(var(--primary))';
    case 'startup-support': return 'hsl(var(--secondary))';
    case 'infrastructure': return 'hsl(var(--teal))';
    case 'public-issue': return 'hsl(var(--warning))';
    case 'emergency': return 'hsl(var(--destructive))';
    default: return 'hsl(var(--muted))';
  }
};

// Get default stats data for initial render
export const getDefaultStatsData = (): StatsData => {
  return {
    totalRequests: 147,
    totalRequestsChange: 12,
    pendingRequests: 42,
    pendingRequestsChange: 8,
    completedRequests: 89,
    completedRequestsChange: 24,
    emergencyRequests: 16,
    criticalEmergencies: 5
  };
};

// Get default category chart data
export const getDefaultCategoryData = (): CategoryChartData[] => {
  return [
    { name: 'Appointments', value: 52, percentage: 35, color: '#1a56db' },
    { name: 'Startup Support', value: 22, percentage: 15, color: '#7e3af2' },
    { name: 'Infrastructure', value: 37, percentage: 25, color: '#0694a2' },
    { name: 'Public Issues', value: 22, percentage: 15, color: '#ff5a1f' },
    { name: 'Emergency', value: 14, percentage: 10, color: '#e02424' }
  ];
};

// Get default status chart data
export const getDefaultStatusData = (): StatusChartData[] => {
  return [
    { name: 'New', count: 28, percentage: 19, color: '#9ca3af' },
    { name: 'In Progress', count: 42, percentage: 29, color: '#3b82f6' },
    { name: 'Under Review', count: 14, percentage: 10, color: '#8b5cf6' },
    { name: 'Awaiting Feedback', count: 18, percentage: 12, color: '#06b6d4' },
    { name: 'Resolved', count: 45, percentage: 30, color: '#10b981' }
  ];
};

// Get initial app state
export const getInitialAppState = (): AppState => {
  return {
    selectedTimePeriod: 'this-month',
    currentModal: null,
    selectedRequestId: null,
    selectedCategory: 'all',
    selectedPriority: 'all',
    selectedStatus: 'all',
    searchQuery: ''
  };
};

// Helper function to format date with relative notation for today/tomorrow
export const formatAppointmentDate = (date: Date): { formattedDate: string, isToday: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const appointmentDate = new Date(date);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const isToday = appointmentDate.getDate() === today.getDate() && 
                  appointmentDate.getMonth() === today.getMonth() && 
                  appointmentDate.getFullYear() === today.getFullYear();
  
  const isTomorrow = appointmentDate.getDate() === tomorrow.getDate() && 
                    appointmentDate.getMonth() === tomorrow.getMonth() && 
                    appointmentDate.getFullYear() === tomorrow.getFullYear();
  
  let formattedDate;
  if (isToday) {
    formattedDate = 'Today';
  } else if (isTomorrow) {
    formattedDate = 'Tomorrow';
  } else {
    formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return { formattedDate, isToday };
};
