import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TeamMember } from '@shared/schema';
// Fix import path without extension
import { useTeamMembersQuery } from '@/hooks/use-queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AssignRequestProps {
  requestId: number;
  currentAssigneeId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignRequest({ requestId, currentAssigneeId, onClose, onSuccess }: AssignRequestProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(currentAssigneeId);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: teamMembers, isLoading } = useTeamMembersQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: async ({ requestId, assignedToId }: { requestId: number, assignedToId: number | null }) => {
      return apiRequest(`/api/requests/${requestId}`, 'PATCH', { assignedToId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/requests/details', requestId] });
      toast({
        title: 'Request assigned successfully',
        description: selectedMemberId 
          ? `The request has been assigned to a team member.` 
          : 'The request has been unassigned.',
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Failed to assign request',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleAssign = () => {
    assignMutation.mutate({ requestId, assignedToId: selectedMemberId });
  };

  const filteredTeamMembers = teamMembers?.filter((member: TeamMember) => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleUnassign = () => {
    setSelectedMemberId(null);
  };

  const getMemberInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Request</DialogTitle>
          <DialogDescription>
            Assign this request to a team member who will be responsible for handling it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTeamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No team members found matching your search.
            </div>
          ) : (
            <RadioGroup value={selectedMemberId?.toString()} onValueChange={(value) => setSelectedMemberId(Number(value))}>
              {filteredTeamMembers.map((member: TeamMember) => (
                <div key={member.id} className="flex items-center space-x-3 py-2 px-1 hover:bg-gray-50 rounded-md cursor-pointer">
                  <RadioGroupItem 
                    value={member.id.toString()} 
                    id={`member-${member.id}`} 
                    className="data-[state=checked]:border-primary-600 data-[state=checked]:text-primary-600"
                  />
                  <Label htmlFor={`member-${member.id}`} className="flex items-center flex-1 cursor-pointer">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getMemberInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-gray-500">{member.role}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between mt-5 gap-2">
          <Button
            variant="outline"
            onClick={handleUnassign}
            disabled={!selectedMemberId}
          >
            Unassign
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}