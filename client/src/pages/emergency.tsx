import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/hooks/use-app-store';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from '@/components/ui/card';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Phone, 
  Clock, 
  UserPlus, 
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

const Emergency = () => {
  const { setCurrentModal } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');

  const { data: requests, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { 
      category: 'emergency', 
      priority: priorityFilter, 
      status: statusFilter, 
      search: searchTerm 
    }],
  });

  // Set page title
  useEffect(() => {
    document.title = "Emergency Requests - Constituency Connect";
  }, []);

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const handleViewRequest = (id: number) => {
    setCurrentModal('request-details', id);
  };

  const handleCallRequestor = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentModal('call-requestor', id);
  };

  const handleAssignRequest = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentModal('assign-request', id);
  };

  // Filter high priority emergency requests first
  const criticalRequests = requests?.filter(r => r.priority === 'high' && r.status !== 'resolved') || [];
  const nonCriticalRequests = requests?.filter(r => r.priority !== 'high' || r.status === 'resolved') || [];

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
            <AlertTriangle className="w-6 h-6 mr-2 text-destructive" />
            <h1 className="text-2xl font-semibold text-gray-900">Emergency Requests</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage urgent constituent needs requiring immediate attention</p>
        </motion.div>
        <motion.div 
          className="mt-4 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button onClick={handleNewRequest} className="bg-destructive hover:bg-destructive/90">
            <Plus className="w-4 h-4 mr-2" />
            New Emergency Request
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 mb-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                  Critical Emergencies
                </CardTitle>
                <CardDescription>
                  High priority emergency requests that need immediate attention
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search emergencies..."
                    className="pl-9 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
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
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border border-destructive/20 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : criticalRequests.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-destructive/20 rounded-lg">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No critical emergencies</h3>
                <p className="text-gray-500 mt-1">
                  All high priority emergency requests have been addressed
                </p>
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {criticalRequests.map((request) => (
                    <motion.div 
                      key={request.id}
                      variants={itemVariants}
                      onClick={() => handleViewRequest(request.id)}
                      className="border border-destructive/20 rounded-lg p-4 hover:bg-red-50 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.01 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                        <div className="flex items-start">
                          <div className="relative">
                            <Avatar className="h-12 w-12 mr-4 border-2 border-destructive">
                              <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                              <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-gray-900">{request.constituent.name}</h3>
                              <Badge variant="outline" className="ml-2 bg-destructive/10 text-destructive border-destructive/20">
                                High Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 font-medium mt-1">{request.subject}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Location data</span>
                              <Clock className="h-3 w-3 ml-3 mr-1" />
                              <span>{request.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center ml-16 md:ml-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-destructive/20 text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleCallRequestor(request.id, e)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => handleAssignRequest(request.id, e)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleViewRequest(request.id)}
                          >
                            Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{formatStatus(request.status)}</span>
                          <span>Emergency Response Progress</span>
                        </div>
                        <Progress 
                          value={
                            request.status === 'new' ? 10 : 
                            request.status === 'in-progress' ? 40 : 
                            request.status === 'under-review' ? 60 : 
                            request.status === 'awaiting-feedback' ? 80 : 100
                          } 
                          className="h-2" 
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Emergency Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No emergency requests found</h3>
              <p className="text-gray-500 mt-1">
                Your emergency request queue is clear
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid gap-4 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {nonCriticalRequests.map((request) => (
                <motion.div 
                  key={request.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleViewRequest(request.id)}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                        <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{request.constituent.name}</h3>
                        <p className="text-sm text-gray-500">{request.subject}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{request.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {formatStatus(request.status)}
                      </Badge>
                      <Badge className={`${getPriorityBadgeClass(request.priority)} mt-1`} variant="outline">
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
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

export default Emergency;
