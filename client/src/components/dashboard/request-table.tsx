import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, DashboardRequest, Priority, Status } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Phone, UserPlus } from 'lucide-react';
import { useAppStore } from '@/hooks/use-app-store';
import { useQuery } from '@tanstack/react-query';

const RequestTable = () => {
  const { 
    selectedCategory, 
    selectedPriority, 
    selectedStatus, 
    searchQuery,
    setSelectedCategory,
    setSelectedPriority,
    setSelectedStatus,
    setCurrentModal
  } = useAppStore();
  
  const [page, setPage] = useState(1);
  const perPage = 5;

  const { data: requestsData, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { category: selectedCategory, priority: selectedPriority, status: selectedStatus, search: searchQuery }],
  });

  const { data: totalCount } = useQuery<number>({
    queryKey: ['/api/requests/count', { category: selectedCategory, priority: selectedPriority, status: selectedStatus, search: searchQuery }],
  });

  const requests = useMemo(() => {
    return requestsData || [];
  }, [requestsData]);

  const filteredRequests = useMemo(() => {
    // Pagination
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return requests.slice(start, end);
  }, [requests, page]);

  const totalPages = useMemo(() => {
    return Math.ceil((totalCount || requests.length) / perPage);
  }, [totalCount, requests.length]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const viewDetails = (id: number) => {
    setCurrentModal('request-details', id);
  };

  const callRequestor = (id: number) => {
    setCurrentModal('call-requestor', id);
  };

  const assignRequest = (id: number) => {
    setCurrentModal('assign-request', id);
  };

  const getCategoryBadgeClass = (category: Category) => {
    switch(category) {
      case 'appointment': return 'badge-appointment';
      case 'startup-support': return 'badge-startup';
      case 'infrastructure': return 'badge-infrastructure';
      case 'public-issue': return 'badge-public';
      case 'emergency': return 'badge-emergency';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch(priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: Status) => {
    switch(status) {
      case 'new': return 'badge-new';
      case 'in-progress': return 'badge-in-progress';
      case 'under-review': return 'badge-under-review';
      case 'awaiting-feedback': return 'badge-awaiting-feedback';
      case 'resolved': return 'badge-resolved';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = (category: Category): string => {
    switch(category) {
      case 'appointment': return 'Appointment';
      case 'startup-support': return 'Startup Support';
      case 'infrastructure': return 'Infrastructure';
      case 'public-issue': return 'Public Issue';
      case 'emergency': return 'Emergency';
      default: return category;
    }
  };

  const formatStatus = (status: Status): string => {
    switch(status) {
      case 'in-progress': return 'In Progress';
      case 'under-review': return 'Under Review';
      case 'awaiting-feedback': return 'Awaiting Feedback';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-5 mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between px-6 py-4 bg-white border-b border-gray-200">
          <CardTitle className="text-lg font-medium">Recent Requests</CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value as any)}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="startup-support">Startup Support</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="public-issue">Public Issues</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedPriority} 
              onValueChange={(value) => setSelectedPriority(value as any)}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => setSelectedStatus(value as any)}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="All Statuses" />
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requestor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full" />
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-32" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-40" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gray-200 rounded w-24" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <AnimatePresence mode="wait">
                    {filteredRequests.map((request) => (
                      <motion.tr 
                        key={request.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
                        onClick={() => viewDetails(request.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={request.constituent.avatar} alt="Requestor profile" />
                                <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{request.constituent.name}</div>
                              <div className="text-sm text-gray-500">{request.constituent.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(request.category)}`}>
                            {formatCategory(request.category)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{request.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(request.priority)}`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                            {formatStatus(request.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              assignRequest(request.id);
                            }}
                          >
                            {request.assignedTo ? (
                              <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md p-1">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={request.assignedTo.avatar} alt="Team member profile" />
                                  <AvatarFallback>{request.assignedTo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[120px]">{request.assignedTo.name}</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200">
                                <UserPlus className="w-4 h-4 mr-1" />
                                Assign
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-primary-600 hover:text-primary-900 hover:bg-primary-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewDetails(request.id);
                              }}
                            >
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                callRequestor(request.id);
                              }}
                            >
                              <Phone className="w-5 h-5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
            <span className="text-xs text-gray-500 sm:text-sm">
              Showing {isLoading ? '...' : `${filteredRequests.length} of ${totalCount || requests.length}`} requests
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={page === 1}
                className="text-sm font-medium text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 rounded-l-md"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={page >= totalPages}
                className="text-sm font-medium text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 rounded-r-md border-l-0"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RequestTable;
