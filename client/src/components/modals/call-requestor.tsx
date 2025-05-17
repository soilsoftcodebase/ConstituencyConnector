import { useState } from 'react';
import { useAppStore } from '@/hooks/use-app-store';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RequestWithRelations } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Phone, ClipboardCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CallRequestor = () => {
  const { currentModal, selectedRequestId, setCurrentModal } = useAppStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<'preparing' | 'calling' | 'completed'>('preparing');
  const [callOutcome, setCallOutcome] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const isOpen = currentModal === 'call-requestor' && selectedRequestId !== null;

  const { data: request } = useQuery<RequestWithRelations>({
    queryKey: ['/api/requests/details', selectedRequestId],
    enabled: isOpen && selectedRequestId !== null,
  });

  const logCallMutation = useMutation({
    mutationFn: async (data: { outcome: string, notes: string }) => {
      return apiRequest('POST', `/api/requests/${selectedRequestId}/call-logs`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests/details', selectedRequestId] });
      toast({
        title: "Call logged successfully",
        description: "The call details have been recorded.",
      });
      setCurrentModal(null);
    }
  });

  const startCall = () => {
    setCallStatus('calling');
    // Simulate calling
    setTimeout(() => {
      setCallStatus('completed');
    }, 2000);
  };

  const logCall = async () => {
    if (!callOutcome) {
      toast({
        title: "Call outcome required",
        description: "Please select a call outcome before saving.",
        variant: "destructive"
      });
      return;
    }
    
    await logCallMutation.mutateAsync({
      outcome: callOutcome,
      notes: callNotes
    });
  };

  if (!request) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && setCurrentModal(null)}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500 text-sm">Loading constituent details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setCurrentModal(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'preparing' && 'Call Constituent'}
            {callStatus === 'calling' && 'Calling...'}
            {callStatus === 'completed' && 'Call Completed'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={request.constituent.avatar} alt={request.constituent.name} />
              <AvatarFallback>{request.constituent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{request.constituent.name}</h2>
            <p className="text-gray-500">{request.constituent.phone}</p>
            
            {callStatus === 'preparing' && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="mb-2">Regarding Request #{request.id}</Badge>
                <p className="text-sm text-gray-700">{request.subject}</p>
              </div>
            )}
            
            {callStatus === 'calling' && (
              <motion.div 
                className="mt-6 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-75"></div>
                  <div className="relative rounded-full bg-primary-500 p-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
            )}
            
            {callStatus === 'completed' && (
              <motion.div 
                className="mt-6 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-success-500 mx-auto mb-2" />
                  <p className="text-gray-700">Call with {request.constituent.name} completed</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Call Outcome</label>
                    <Select value={callOutcome} onValueChange={setCallOutcome}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contacted">Successfully Contacted</SelectItem>
                        <SelectItem value="not-available">Not Available / Voicemail</SelectItem>
                        <SelectItem value="wrong-number">Wrong Number</SelectItem>
                        <SelectItem value="follow-up-required">Follow-up Required</SelectItem>
                        <SelectItem value="issue-resolved">Issue Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Call Notes</label>
                    <Textarea 
                      placeholder="Enter details about the call..." 
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <DialogFooter>
          {callStatus === 'preparing' && (
            <>
              <Button variant="outline" onClick={() => setCurrentModal(null)}>
                Cancel
              </Button>
              <Button onClick={startCall}>
                <Phone className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            </>
          )}
          
          {callStatus === 'calling' && (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={() => setCallStatus('completed')}
            >
              End Call
            </Button>
          )}
          
          {callStatus === 'completed' && (
            <>
              <Button variant="outline" onClick={() => setCurrentModal(null)}>
                Cancel
              </Button>
              <Button 
                onClick={logCall} 
                disabled={logCallMutation.isPending}
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                {logCallMutation.isPending ? 'Saving...' : 'Log Call'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallRequestor;
