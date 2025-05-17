import { motion } from 'framer-motion';
import { Status } from '@/types';
import { CheckCircle, Clock, AlertCircle, HelpCircle, RefreshCw } from 'lucide-react';

interface RequestTimelineProps {
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// Status order for the timeline
const statusOrder: Status[] = [
  'new',
  'in-progress',
  'under-review',
  'awaiting-feedback',
  'resolved'
];

// Emojis for each status
const statusEmojis = {
  'new': '🆕',
  'in-progress': '🏗️',
  'under-review': '🔍',
  'awaiting-feedback': '📝',
  'resolved': '✅'
};

// Status labels for display
const statusLabels = {
  'new': 'New Request',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  'awaiting-feedback': 'Awaiting Feedback',
  'resolved': 'Resolved'
};

// Icons for each status
const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case 'new':
      return <AlertCircle className="w-6 h-6" />;
    case 'in-progress':
      return <RefreshCw className="w-6 h-6" />;
    case 'under-review':
      return <HelpCircle className="w-6 h-6" />;
    case 'awaiting-feedback':
      return <Clock className="w-6 h-6" />;
    case 'resolved':
      return <CheckCircle className="w-6 h-6" />;
    default:
      return null;
  }
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

export default function RequestTimeline({ status, createdAt, updatedAt }: RequestTimelineProps) {
  // Find the current status index
  const currentStatusIndex = statusOrder.indexOf(status);
  
  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-medium mb-4">Request Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-9 top-0 w-1 h-full bg-gray-200 z-0"></div>
        
        {/* Timeline points */}
        <div className="relative z-10">
          {statusOrder.map((stepStatus, index) => {
            const isPast = index <= currentStatusIndex;
            const isCurrent = stepStatus === status;
            
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
                    <StatusIcon status={stepStatus} />
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
                      ? `Updated: ${formatDate(updatedAt)}`
                      : isPast 
                        ? `Completed: ${formatDate(updatedAt)}`
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
  );
}