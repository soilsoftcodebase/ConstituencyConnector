import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssignedMemberProps {
  assignee?: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
  } | null;
  onClick?: () => void;
  compact?: boolean;
}

const AssignedMember: React.FC<AssignedMemberProps> = ({ 
  assignee, 
  onClick,
  compact = false
}) => {
  if (!assignee) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-gray-500 ${compact ? 'p-0 h-auto' : ''}`}
        onClick={onClick}
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        {compact ? '' : 'Unassigned'}
      </Button>
    );
  }

  const avatarComponent = (
    <Avatar className={compact ? "h-8 w-8" : "h-8 w-8 mr-2"}>
      <AvatarImage src={assignee.avatar} alt={assignee.name} />
      <AvatarFallback>
        {assignee.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={onClick}>
              {avatarComponent}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{assignee.name}</p>
            <p className="text-xs text-gray-500">{assignee.role}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="flex items-center" onClick={onClick}>
      {avatarComponent}
      <div className="text-left">
        <p className="text-sm font-medium truncate">{assignee.name}</p>
        <p className="text-xs text-gray-500 truncate">{assignee.role}</p>
      </div>
    </Button>
  );
};

export default AssignedMember;