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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, Constituent, Priority } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, AlertTriangle } from 'lucide-react';

interface NewRequestForm {
  constituentId: number | null;
  category: Category | '';
  subject: string;
  description: string;
  priority: Priority | '';
  location?: string;
}

const NewRequest = () => {
  const { currentModal, setCurrentModal } = useAppStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isOpen = currentModal === 'new-request';
  
  const [step, setStep] = useState<'constituent' | 'details'>('constituent');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<NewRequestForm>({
    constituentId: null,
    category: '',
    subject: '',
    description: '',
    priority: '',
    location: '',
  });

  const { data: constituents, isLoading: isLoadingConstituents } = useQuery<Constituent[]>({
    queryKey: ['/api/constituents', { search: searchTerm }],
    enabled: isOpen && step === 'constituent',
  });

  const { data: selectedConstituent } = useQuery<Constituent>({
    queryKey: ['/api/constituents', form.constituentId],
    enabled: isOpen && form.constituentId !== null,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: Omit<NewRequestForm, 'constituentId'> & { constituentId: number }) => {
      return apiRequest('POST', '/api/requests', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      toast({
        title: "Request created",
        description: "The new constituent request has been created successfully.",
      });
      
      // Reset form and close modal
      setForm({
        constituentId: null,
        category: '',
        subject: '',
        description: '',
        priority: '',
        location: '',
      });
      setStep('constituent');
      setCurrentModal(null);
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const selectConstituent = (constituentId: number) => {
    setForm({ ...form, constituentId });
    setStep('details');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.constituentId) {
      toast({
        title: "Missing constituent",
        description: "Please select a constituent for this request.",
        variant: "destructive"
      });
      return;
    }
    
    if (!form.category || !form.subject || !form.description || !form.priority) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    await createRequestMutation.mutateAsync({
      ...form,
      constituentId: form.constituentId
    } as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setCurrentModal(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{step === 'constituent' ? 'Select Constituent' : 'New Request'}</DialogTitle>
        </DialogHeader>

        {step === 'constituent' ? (
          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search constituents by name, email or phone"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="h-72 overflow-y-auto border rounded-md">
              {isLoadingConstituents ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading constituents...</p>
                </div>
              ) : constituents && constituents.length > 0 ? (
                <div className="divide-y">
                  {constituents.map((constituent) => (
                    <div
                      key={constituent.id}
                      className="p-3 flex items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => selectConstituent(constituent.id)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={constituent.avatar} alt={constituent.name} />
                        <AvatarFallback>{constituent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{constituent.name}</p>
                        <p className="text-xs text-gray-500">{constituent.email} • {constituent.phone}</p>
                        {constituent.district && (
                          <p className="text-xs text-gray-500">District: {constituent.district}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-gray-500">No constituents found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4">
            {selectedConstituent && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedConstituent.avatar} alt={selectedConstituent.name} />
                  <AvatarFallback>{selectedConstituent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedConstituent.name}</p>
                  <p className="text-xs text-gray-500">{selectedConstituent.phone} • {selectedConstituent.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs"
                  onClick={() => setStep('constituent')}
                >
                  Change
                </Button>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select 
                    value={form.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="startup-support">Startup Support</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="public-issue">Public Issue</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority*</Label>
                  <Select 
                    value={form.priority} 
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject*</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the request"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the request"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  placeholder="Relevant location information"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setCurrentModal(null)}>
            Cancel
          </Button>
          
          {step === 'constituent' ? (
            <Button
              disabled={!form.constituentId}
              onClick={() => setStep('details')}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createRequestMutation.isPending || !form.category || !form.subject || !form.description || !form.priority}
            >
              {createRequestMutation.isPending ? 'Creating...' : 'Create Request'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequest;
