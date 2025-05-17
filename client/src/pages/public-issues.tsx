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
import { Users, Plus, Search, Filter, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

const PublicIssues = () => {
  const { setCurrentModal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const { data: requests, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { 
      category: 'public-issue', 
      priority: priorityFilter, 
      status: statusFilter, 
      search: searchTerm 
    }],
  });

  // Set page title
  useEffect(() => {
    document.title = "Public Issues - Constituency Connect";
  }, []);

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const handleViewRequest = (id: number) => {
    setCurrentModal('request-details', id);
  };

  // Group requests by status for the kanban view
  const groupedRequests = {
    new: requests?.filter(r => r.status === 'new') || [],
    inProgress: requests?.filter(r => r.status === 'in-progress') || [],
    underReview: requests?.filter(r => r.status === 'under-review') || [],
    awaitingFeedback: requests?.filter(r => r.status === 'awaiting-feedback') || [],
    resolved: requests?.filter(r => r.status === 'resolved') || []
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
            <Users className="w-6 h-6 mr-2 text-warning-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Public Issues</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage community concerns, complaints, and public service issues</p>
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

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Public Issue Requests</CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search requests..."
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
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !requests || requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No public issues found</h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your filters or search criteria
                </p>
              </CardContent>
            </Card>
          ) : (
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
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewRequest(request.id)}
                  >
                    <CardContent className="p-4">
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
                        <div className="flex flex-wrap items-center gap-2 justify-end">
                          <Badge className={getPriorityBadgeClass(request.priority)}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </Badge>
                          <Badge className={getStatusBadgeClass(request.status)}>
                            {formatStatus(request.status)}
                          </Badge>
                          <div className="text-xs text-gray-500">{request.date}</div>
                          {request.assignedTo && (
                            <div className="flex items-center ml-2 bg-gray-100 px-2 py-1 rounded-full">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={request.assignedTo.avatar} alt={request.assignedTo.name} />
                                <AvatarFallback>{request.assignedTo.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{request.assignedTo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="kanban">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse">
                  <CardHeader className="p-3">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-4">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-20 bg-gray-100 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <KanbanColumn 
                title="New" 
                icon={<AlertTriangle className="h-4 w-4 text-gray-500" />}
                requests={groupedRequests.new}
                onClickRequest={handleViewRequest}
              />
              <KanbanColumn 
                title="In Progress" 
                icon={<Clock className="h-4 w-4 text-primary-500" />}
                requests={groupedRequests.inProgress}
                onClickRequest={handleViewRequest}
              />
              <KanbanColumn 
                title="Under Review" 
                icon={<Filter className="h-4 w-4 text-secondary-500" />}
                requests={groupedRequests.underReview}
                onClickRequest={handleViewRequest}
              />
              <KanbanColumn 
                title="Awaiting Feedback" 
                icon={<Users className="h-4 w-4 text-teal-500" />}
                requests={groupedRequests.awaitingFeedback}
                onClickRequest={handleViewRequest}
              />
              <KanbanColumn 
                title="Resolved" 
                icon={<CheckCircle2 className="h-4 w-4 text-success-500" />}
                requests={groupedRequests.resolved}
                onClickRequest={handleViewRequest}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

interface KanbanColumnProps {
  title: string;
  icon: React.ReactNode;
  requests: DashboardRequest[];
  onClickRequest: (id: number) => void;
}

const KanbanColumn = ({ title, icon, requests, onClickRequest }: KanbanColumnProps) => {
  return (
    <Card>
      <CardHeader className="py-3 px-3">
        <div className="flex items-center">
          {icon}
          <CardTitle className="text-sm ml-2">{title} ({requests.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 max-h-[600px] overflow-y-auto scrollbar-hide">
        <motion.div
          className="space-y-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {requests.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              No requests
            </div>
          ) : (
            requests.map(request => (
              <motion.div
                key={request.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border rounded-md p-3 cursor-pointer shadow-sm hover:shadow-md transition-all"
                onClick={() => onClickRequest(request.id)}
              >
                <div className="text-sm font-medium mb-2 line-clamp-2">{request.subject}</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-1">
                      <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                      <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{request.constituent.name.split(' ')[0]}</span>
                  </div>
                  <Badge className={getPriorityBadgeClass(request.priority)} variant="outline">
                    {request.priority.charAt(0).toUpperCase()}
                  </Badge>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PublicIssues;
