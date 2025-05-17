import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/hooks/use-app-store';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { TrafficCone, Plus, Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardRequest, Priority, Status } from '@/types';
import { 
  getPriorityBadgeClass, 
  getStatusBadgeClass,
  formatStatus 
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Infrastructure = () => {
  const { setCurrentModal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const { data: requests, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { 
      category: 'infrastructure', 
      priority: priorityFilter, 
      status: statusFilter, 
      search: searchTerm 
    }],
  });

  // Set page title
  useEffect(() => {
    document.title = "Infrastructure Issues - Constituency Connect";
  }, []);

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const handleViewRequest = (id: number) => {
    setCurrentModal('request-details', id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

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
          <div className="flex items-center">
            <TrafficCone className="w-6 h-6 mr-2 text-teal-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Infrastructure Issues</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage roads, public utilities, and infrastructure maintenance requests</p>
        </motion.div>
        <motion.div 
          className="mt-4 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button onClick={handleNewRequest}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Infrastructure Requests</CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by location or issue..."
                  className="pl-9 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={priorityFilter} 
                onValueChange={setPriorityFilter as any}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter as any}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="awaiting-feedback">Awaiting Feedback</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8">
              <TrafficCone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No infrastructure requests found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {requests.map((request) => (
                <motion.div 
                  key={request.id}
                  variants={itemVariants}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewRequest(request.id)}
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{request.subject}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">Jubilee Hills TrafficCone No. 5, Hyderabad</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                        <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{request.constituent.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getPriorityBadgeClass(request.priority)}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </Badge>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {formatStatus(request.status)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Infrastructure;
