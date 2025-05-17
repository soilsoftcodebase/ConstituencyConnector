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
import { Package2, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardRequest, Priority, Status } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  getPriorityBadgeClass, 
  getStatusBadgeClass,
  formatStatus 
} from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StartupSupport = () => {
  const { setCurrentModal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'funding' | 'mentorship' | 'resources'>('all');

  const { data: requests, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { 
      category: 'startup-support', 
      priority: priorityFilter, 
      status: statusFilter, 
      search: searchTerm 
    }],
  });

  // Set page title
  useEffect(() => {
    document.title = "Startup Support - Constituency Connect";
  }, []);

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const handleViewRequest = (id: number) => {
    setCurrentModal('request-details', id);
  };

  // Filter requests based on active tab
  const filteredRequests = requests?.filter(request => {
    if (activeTab === 'all') return true;
    
    // This is a simple filtering logic. In a real app, you'd have a "subtype" field
    // or tags to properly categorize startup support requests
    const subject = request.subject.toLowerCase();
    
    if (activeTab === 'funding' && (subject.includes('fund') || subject.includes('financ') || subject.includes('investment'))) {
      return true;
    }
    
    if (activeTab === 'mentorship' && (subject.includes('mentor') || subject.includes('guidance') || subject.includes('advise'))) {
      return true;
    }
    
    if (activeTab === 'resources' && (subject.includes('resource') || subject.includes('space') || subject.includes('equipment'))) {
      return true;
    }
    
    return false;
  });

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
            <Package2 className="w-6 h-6 mr-2 text-secondary-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Startup Support</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage funding, mentorship, and resource requests for startups</p>
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
            <CardTitle>Startup Support Requests</CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9 w-full md:w-[200px]"
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
          <Tabs
            defaultValue="all"
            className="mb-6"
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {renderRequestList(isLoading, filteredRequests, handleViewRequest, containerVariants, itemVariants)}
            </TabsContent>
            
            <TabsContent value="funding" className="mt-0">
              {renderRequestList(isLoading, filteredRequests, handleViewRequest, containerVariants, itemVariants)}
            </TabsContent>
            
            <TabsContent value="mentorship" className="mt-0">
              {renderRequestList(isLoading, filteredRequests, handleViewRequest, containerVariants, itemVariants)}
            </TabsContent>
            
            <TabsContent value="resources" className="mt-0">
              {renderRequestList(isLoading, filteredRequests, handleViewRequest, containerVariants, itemVariants)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const renderRequestList = (
  isLoading: boolean, 
  requests: DashboardRequest[] | undefined, 
  handleViewRequest: (id: number) => void,
  containerVariants: any,
  itemVariants: any
) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Package2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No startup support requests found</h3>
        <p className="text-gray-500 mt-1">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-4"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-900">{request.constituent.name}</h3>
                <p className="text-sm text-gray-500">{request.subject}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <Badge className={getPriorityBadgeClass(request.priority)}>
                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
              </Badge>
              <Badge className={getStatusBadgeClass(request.status)}>
                {formatStatus(request.status)}
              </Badge>
              <div className="text-xs text-gray-500">{request.date}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StartupSupport;
