import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/hooks/use-app-store';
import { UpcomingAppointment } from '@/types';
import { useQuery } from '@tanstack/react-query';

const UpcomingAppointments = () => {
  const { setCurrentModal } = useAppStore();
  
  const { data: appointments, isLoading } = useQuery<UpcomingAppointment[]>({
    queryKey: ['/api/appointments/upcoming'],
  });

  const upcomingAppointments = useMemo(() => {
    return appointments || [];
  }, [appointments]);

  const handleViewAll = () => {
    window.location.href = '/appointments';
  };

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
      className="col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
          <Button 
            variant="ghost" 
            onClick={handleViewAll}
            className="text-xs font-medium text-primary-700 hover:bg-primary-50"
          >
            View all
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.ul 
              className="-my-5 divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {upcomingAppointments.map((appointment) => (
                <motion.li 
                  key={appointment.id} 
                  className="py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md px-2"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  onClick={() => setCurrentModal('request-details', appointment.id)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.constituent.avatar} alt="Constituent's profile" />
                      <AvatarFallback>{appointment.constituent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{appointment.constituent.name}</p>
                      <p className="text-sm text-gray-500 truncate">{appointment.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.isToday 
                          ? 'bg-primary-100 text-primary-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.isToday ? 'Today' : appointment.date}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingAppointments;
