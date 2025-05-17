import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/hooks/use-app-store';
import StatCard from '@/components/dashboard/stat-card';
import RequestAnalytics from '@/components/dashboard/charts';
import UpcomingAppointments from '@/components/dashboard/upcoming-appointments';
import RequestTable from '@/components/dashboard/request-table';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatsData } from '@/types';
import { getDefaultStatsData } from '@/lib/data';

const Dashboard = () => {
  const { 
    selectedTimePeriod, 
    setSelectedTimePeriod,
    setCurrentModal
  } = useAppStore();

  const { data: statsData, isLoading: isStatsLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats', selectedTimePeriod],
  });

  // Set page title
  useEffect(() => {
    document.title = "Dashboard - Constituency Connect";
  }, []);

  const handleTimePeriodChange = (value: string) => {
    setSelectedTimePeriod(value as any);
  };

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const stats = statsData || getDefaultStatsData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of all constituency requests and activities</p>
        </motion.div>
        <motion.div 
          className="mt-4 md:mt-0 flex space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Select value={selectedTimePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleNewRequest}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </motion.div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={isStatsLoading ? "..." : stats.totalRequests}
          change={isStatsLoading ? 0 : stats.totalRequestsChange}
          icon={<ClipboardList className="w-5 h-5" />}
          iconBgColor="bg-primary-100"
          iconTextColor="text-primary-600"
        />
        
        <StatCard
          title="Pending Requests"
          value={isStatsLoading ? "..." : stats.pendingRequests}
          change={isStatsLoading ? 0 : stats.pendingRequestsChange}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-warning-100"
          iconTextColor="text-warning-600"
        />
        
        <StatCard
          title="Completed Requests"
          value={isStatsLoading ? "..." : stats.completedRequests}
          change={isStatsLoading ? 0 : stats.completedRequestsChange}
          icon={<CheckSquare className="w-5 h-5" />}
          iconBgColor="bg-success-100"
          iconTextColor="text-success-600"
        />
        
        <StatCard
          title="Emergency Requests"
          value={isStatsLoading ? "..." : stats.emergencyRequests}
          change={0} // No change indicator for emergencies
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBgColor="bg-destructive-100"
          iconTextColor="text-destructive-600"
          secondary={isStatsLoading ? "" : `${stats.criticalEmergencies} urgent`}
        />
      </div>
      
      {/* Charts and Upcoming Appointments */}
      <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
        <RequestAnalytics />
        <UpcomingAppointments />
      </div>
      
      {/* Recent Requests Table */}
      <RequestTable />
    </motion.div>
  );
};

export default Dashboard;
