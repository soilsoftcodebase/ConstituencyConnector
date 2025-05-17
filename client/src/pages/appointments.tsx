import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAppStore } from '@/hooks/use-app-store';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar as CalendarIcon, UserCheck, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DashboardRequest } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeClass } from '@/lib/data';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Appointments = () => {
  const { setCurrentModal } = useAppStore();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: requests, isLoading } = useQuery<DashboardRequest[]>({
    queryKey: ['/api/requests', { category: 'appointment', priority: 'all', status: statusFilter !== 'all' ? statusFilter : 'all', search: searchTerm }],
  });

  // Set page title
  useEffect(() => {
    document.title = "Appointment Requests - Constituency Connect";
  }, []);

  const handleNewRequest = () => {
    setCurrentModal('new-request');
  };

  const handleViewRequest = (id: number) => {
    setCurrentModal('request-details', id);
  };

  // Pagination configuration
  const itemsPerPageOptions = [5, 10, 20, 50];

  // Filter appointments by the selected date
  const filteredRequests = requests?.filter(request => {
    if (!date) return true;
    
    const requestDate = new Date(request.date);
    return (
      requestDate.getDate() === date.getDate() &&
      requestDate.getMonth() === date.getMonth() &&
      requestDate.getFullYear() === date.getFullYear()
    );
  });

  // Pagination logic
  const totalItems = filteredRequests?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedRequests = filteredRequests?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [date, statusFilter, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          <div className="flex items-center">
            <UserCheck className="w-6 h-6 mr-2 text-primary-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Appointment Requests</h1>
          </div>
          <p className="text-sm text-gray-500">Manage meeting and appointment requests from constituents</p>
        </motion.div>
        <motion.div 
          className="flex shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button onClick={handleNewRequest}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar & Filters */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Date Picker</CardTitle>
            <CardDescription>Filter appointments by date</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full border-0"
              classNames={{
                months: "space-y-4 mx-auto",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center gap-1",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                row: "flex w-full mt-2",
                cell: "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                day_selected: "bg-primary-600 text-white hover:bg-primary-600 hover:text-white focus:bg-primary-600 focus:text-white",
                day_today: "bg-gray-100 text-gray-900",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-400 opacity-50 hover:bg-transparent",
                day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                day_hidden: "invisible",
              }}
            />
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={() => setDate(undefined)}
              >
                Clear Date Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-3 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                <CardTitle>Appointments</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search appointments..."
                      className="pl-9 w-full sm:w-[200px]"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
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
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRequests && filteredRequests.length > 0 ? (
                <React.Fragment>
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {(paginatedRequests || []).map((request) => (
                      <motion.div 
                        key={request.id}
                        variants={itemVariants}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewRequest(request.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4 shrink-0">
                              <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                              <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{request.constituent.name}</h3>
                              <p className="text-sm text-gray-500 truncate">{request.subject}</p>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                            <Badge className={getStatusBadgeClass(request.status)}>
                              {request.status === 'in-progress' ? 'In Progress' : 
                               request.status === 'under-review' ? 'Under Review' :
                               request.status === 'awaiting-feedback' ? 'Awaiting Feedback' :
                               request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            <div className="flex items-center mt-0 sm:mt-2">
                              <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-500">{request.date}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                    {totalPages > 1 && (
                    <div className="flex justify-center sm:justify-end flex-1">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page => Math.max(1, page - 1));
                              }}
                              className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              if (totalPages <= 7) return true;
                              if (page === 1 || page === totalPages) return true;
                              if (Math.abs(currentPage - page) <= 1) return true;
                              return false;
                            })
                            .map((page, i, array) => (
                              <React.Fragment key={page}>
                                {i > 0 && array[i - 1] !== page - 1 && (
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                )}
                                <PaginationItem>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(page);
                                    }}
                                    isActive={currentPage === page}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                            ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page => Math.min(totalPages, page + 1));
                              }}
                              className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Rows per page:</span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder={pageSize} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>
                      {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                    </span>
                  </div>
                  </div>
                </React.Fragment>
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No appointment requests found. Adjust your filters or create a new appointment request.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Appointments;
