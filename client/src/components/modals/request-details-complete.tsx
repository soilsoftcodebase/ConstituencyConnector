import { useState, useEffect } from 'react';
import { useAppStore } from '@/hooks/use-app-store';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Mail, Home, FileText, CheckSquare, AlertTriangle, MessageCircle, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestWithRelations, Status, Priority, TeamMember } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

// Status order for the timeline
const statusOrder: Status[] = [
  'new',
  'in-progress',
  'under-review',
  'awaiting-feedback',
  'resolved'
];

// Emojis for each status
const statusEmojis: Record<Status, string> = {
  'new': '🆕',
  'in-progress': '🏗️',
  'under-review': '🔍',
  'awaiting-feedback': '📝',
  'resolved': '✅'
};

// Status labels for display
const statusLabels: Record<Status, string> = {
  'new': 'New Request',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  'awaiting-feedback': 'Awaiting Feedback',
  'resolved': 'Resolved'
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const RequestDetails = () => {
  const { currentModal, selectedRequestId, setCurrentModal } = useAppStore();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<Status | ''>('');
  const [newPriority, setPriority] = useState<Priority | ''>('');
  const [note, setNote] = useState('');
  const isOpen = currentModal === 'request-details' && selectedRequestId !== null;

  const { data: request, isLoading } = useQuery<RequestWithRelations>({
    queryKey: ['/api/requests/details', selectedRequestId],
    enabled: isOpen && selectedRequestId !== null,
  });

  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
    enabled: isOpen,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async (data: { status?: Status, priority?: Priority, assignedToId?: number | null }) => {
      return apiRequest('PATCH', `/api/requests/${selectedRequestId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/requests/details', selectedRequestId] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    }
  });

  const addNoteMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiRequest('POST', `/api/requests/${selectedRequestId}/notes`, { text });
    },
    onSuccess: () => {
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['/api/requests/details', selectedRequestId] });
    }
  });

  useEffect(() => {
    if (request) {
      setNewStatus(request.status);
      setPriority(request.priority);
    }
  }, [request]);

  const handleStatusChange = async (value: Status) => {
    setNewStatus(value);
    await updateRequestMutation.mutateAsync({ status: value });
  };

  const handlePriorityChange = async (value: Priority) => {
    setPriority(value);
    await updateRequestMutation.mutateAsync({ priority: value });
  };

  const handleAssignTeamMember = async (teamMemberId: string) => {
    const id = teamMemberId === 'unassigned' ? null : parseInt(teamMemberId);
    await updateRequestMutation.mutateAsync({ assignedToId: id });
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      await addNoteMutation.mutateAsync(note);
    }
  };

  const getCategoryBadgeClass = () => {
    if (!request) return 'bg-gray-100 text-gray-800';
    
    switch(request.category) {
      case 'appointment': return 'badge-appointment';
      case 'startup-support': return 'badge-startup';
      case 'infrastructure': return 'badge-infrastructure';
      case 'public-issue': return 'badge-public';
      case 'emergency': return 'badge-emergency';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategory = () => {
    if (!request) return '';
    
    switch(request.category) {
      case 'appointment': return 'Appointment';
      case 'startup-support': return 'Startup Support';
      case 'infrastructure': return 'Infrastructure';
      case 'public-issue': return 'Public Issue';
      case 'emergency': return 'Emergency';
      default: return request.category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setCurrentModal(null)}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        {isLoading || !request ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading request details...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                <div className="flex items-center">
                  Request #{request.id}
                  <div className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass()}`}>
                    {formatCategory()}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={newPriority} onValueChange={(val) => handlePriorityChange(val as Priority)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={newStatus} onValueChange={(val) => handleStatusChange(val as Status)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="awaiting-feedback">Awaiting Feedback</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogTitle>
              <DialogDescription className="text-lg font-medium">{request.subject}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes & Updates</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-md text-gray-800 mb-6">
                      <p>{request.description}</p>
                    </div>
                    
                    {request.location && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {request.location}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(request.createdAt).toLocaleDateString()}
                          <Clock className="w-4 h-4 ml-4 mr-2 text-gray-400" />
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(request.updatedAt).toLocaleDateString()}
                          <Clock className="w-4 h-4 ml-4 mr-2 text-gray-400" />
                          {new Date(request.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Team Assignment</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentModal('assign-request', request.id)} 
                          className="flex items-center text-primary-600 border-primary-200"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          {request.assignedToId ? 'Change Assignment' : 'Assign'}
                        </Button>
                      </div>
                      
                      {request.assignedToId && request.assignedTo ? (
                        <div className="bg-primary-50 border border-primary-100 rounded-md p-3 flex items-center">
                          <Avatar className="h-10 w-10 mr-3 border-2 border-primary-200">
                            <AvatarImage src={request.assignedTo.avatar} alt={request.assignedTo.name} />
                            <AvatarFallback>{request.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{request.assignedTo.name}</p>
                            <p className="text-sm text-gray-500">{request.assignedTo.role}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center text-gray-500">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 mr-3">
                            <UserPlus className="h-5 w-5 text-gray-400" />
                          </div>
                          <p>No team member assigned to this request</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Constituent Information</h3>
                      
                      <div className="flex items-center mb-4">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
                          <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{request.constituent.name}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-700">{request.constituent.phone}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-700">{request.constituent.email}</span>
                        </div>
                        
                        {request.constituent.address && (
                          <div className="flex items-start">
                            <Home className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                            <span className="text-gray-700">{request.constituent.address}</span>
                          </div>
                        )}
                      </div>
                      
                      {request.constituent.district && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">District</p>
                          <p className="text-sm font-medium text-gray-900">{request.constituent.district}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full mb-2" onClick={() => setCurrentModal('call-requestor', request.id)}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Constituent
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Add Note</h3>
                  <Textarea 
                    placeholder="Type your note here..." 
                    className="mb-2" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote} disabled={!note.trim()}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">Notes & Updates</h3>
                  
                  {/* Example notes - would be replaced with actual notes from API */}
                  <motion.div 
                    className="bg-gray-50 p-4 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={request.assignedTo?.avatar} alt="Team member" />
                        <AvatarFallback>TM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {request.assignedTo?.name || 'System'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(request.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Status updated to <span className="font-medium">{request.status}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="p-4">
                  {/* Animated Request Timeline with cheerful emojis */}
                  <div className="w-full py-4">
                    <h3 className="text-lg font-medium mb-4">Request Status Timeline</h3>
                    
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-9 top-0 w-1 h-full bg-gray-200 z-0"></div>
                      
                      {/* Timeline points */}
                      <div className="relative z-10">
                        {statusOrder.map((stepStatus, index) => {
                          const isPast = index <= statusOrder.indexOf(request.status);
                          const isCurrent = stepStatus === request.status;
                          
                          return (
                            <div key={stepStatus} className="flex items-start mb-8 relative">
                              {/* Emoji with animated entrance */}
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: isPast ? 1 : 0.5 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-2xl z-10 mr-4 ${
                                  isCurrent ? 'animate-bounce' : ''
                                }`}
                              >
                                {statusEmojis[stepStatus]}
                              </motion.div>
                              
                              {/* Status information */}
                              <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: isPast ? 1 : 0.5, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex-grow"
                              >
                                <div className={`flex items-center text-lg font-medium ${
                                  isPast ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  <span className="ml-2">{statusLabels[stepStatus]}</span>
                                  
                                  {/* Current status indicator */}
                                  {isCurrent && (
                                    <motion.span
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                      className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      Current
                                    </motion.span>
                                  )}
                                </div>
                                
                                {/* Date information */}
                                <p className={`text-sm ${isPast ? 'text-gray-600' : 'text-gray-400'}`}>
                                  {isCurrent 
                                    ? `Updated: ${formatDate(request.updatedAt)}`
                                    : isPast 
                                      ? `Completed: ${formatDate(request.updatedAt)}`
                                      : 'Pending'
                                  }
                                </p>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity History */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Activity History</h3>
                    <div className="relative pl-8 border-l-2 border-gray-200 py-2">
                      <div className="space-y-6">
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="absolute -left-[41px] bg-primary-600 p-1.5 rounded-full border-4 border-white">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-900">Request Created</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              New {request.category} request created by {request.constituent.name}
                            </p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="absolute -left-[41px] bg-warning-500 p-1.5 rounded-full border-4 border-white">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-900">Priority Set</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              Request marked as <Badge variant="outline" className={`font-normal ${request.priority === 'high' ? 'text-destructive' : request.priority === 'medium' ? 'text-warning-500' : 'text-success-600'}`}>{request.priority}</Badge> priority
                            </p>
                          </div>
                        </motion.div>
                        
                        {request.assignedToId && (
                          <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="absolute -left-[41px] bg-secondary-500 p-1.5 rounded-full border-4 border-white">
                              <UserPlus className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-900">Assigned to Team Member</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(request.updatedAt).toLocaleString()}
                              </p>
                              <div className="flex items-center mt-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={request.assignedTo?.avatar} alt="Team member" />
                                  <AvatarFallback>TM</AvatarFallback>
                                </Avatar>
                                <p className="text-sm text-gray-700">
                                  Request assigned to <span className="font-medium">{request.assignedTo?.name}</span>
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="absolute -left-[41px] bg-success-600 p-1.5 rounded-full border-4 border-white">
                            <CheckSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-900">Status Updated</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(request.updatedAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              Status updated to <Badge variant="outline" className="font-normal">{request.status}</Badge>
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attachments">
                <div className="text-center py-8">
                  {request.attachments && request.attachments.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {request.attachments.map((attachment, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4 text-center">
                          <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700 truncate">{attachment}</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No attachments for this request</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetails;