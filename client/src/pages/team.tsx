import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersRound, 
  Search, 
  Mail, 
  Phone, 
  UserPlus,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/types';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch team members
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });

  // Mock data for team performance
  const teamPerformance = [
    { name: 'Meera Joshi', total: 38, completed: 27, pending: 11 },
    { name: 'Raj Khanna', total: 29, completed: 18, pending: 11 },
    { name: 'Nitin Gupta', total: 31, completed: 24, pending: 7 },
    { name: 'Aisha Khan', total: 41, completed: 30, pending: 11 }
  ];

  // Filter team members based on search term
  const filteredTeamMembers = teamMembers?.filter(
    member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Set page title
  useEffect(() => {
    document.title = "Team Management - Constituency Connect";
  }, []);

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
            <UsersRound className="w-6 h-6 mr-2 text-primary-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Manage your team members, roles, and performance</p>
        </motion.div>
        <motion.div 
          className="mt-4 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <CardTitle>Team Members</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-9 w-full md:w-[250px]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-gray-200 mr-4"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !filteredTeamMembers || filteredTeamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <UsersRound className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No team members found</h3>
                  <p className="text-gray-500 mt-1">
                    {searchTerm ? 'Try a different search term' : 'Add team members to get started'}
                  </p>
                </div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredTeamMembers.map((member) => (
                    <motion.div 
                      key={member.id}
                      variants={itemVariants}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center">
                          <Avatar className="h-16 w-16 mr-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">{member.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-20 md:ml-0">
                          {/* Find performance data for this member */}
                          {teamPerformance.find(p => p.name === member.name) && (
                            <div className="flex flex-col items-end">
                              <Badge className="mb-2 bg-primary-100 text-primary-800 hover:bg-primary-200">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                {teamPerformance.find(p => p.name === member.name)?.total} Requests
                              </Badge>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200">
                                  {teamPerformance.find(p => p.name === member.name)?.completed} Completed
                                </Badge>
                                <Badge variant="outline" className="bg-warning-50 text-warning-600 border-warning-200">
                                  {teamPerformance.find(p => p.name === member.name)?.pending} Pending
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary-200 pl-4 py-1 relative">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary-500"></div>
                  <p className="text-sm font-medium">Meera Joshi resolved the water supply issue in Banjara Colony</p>
                  <p className="text-xs text-gray-500">Today, 10:35 AM</p>
                </div>
                <div className="border-l-2 border-primary-200 pl-4 py-1 relative">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary-500"></div>
                  <p className="text-sm font-medium">Raj Khanna assigned to the flood damage emergency in Ramanpet</p>
                  <p className="text-xs text-gray-500">Yesterday, 4:15 PM</p>
                </div>
                <div className="border-l-2 border-primary-200 pl-4 py-1 relative">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary-500"></div>
                  <p className="text-sm font-medium">Nitin Gupta updated status on the road repair project</p>
                  <p className="text-xs text-gray-500">Yesterday, 2:30 PM</p>
                </div>
                <div className="border-l-2 border-primary-200 pl-4 py-1 relative">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary-500"></div>
                  <p className="text-sm font-medium">Aisha Khan called Mohammed Khan regarding his appointment request</p>
                  <p className="text-xs text-gray-500">Jul 12, 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member, index) => {
                  const completionRate = Math.round((member.completed / member.total) * 100);
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{completionRate}% completion</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div 
                          className="bg-primary-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionRate}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <p>{member.completed} completed</p>
                        <p>{member.pending} pending</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Assignment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
                    <span className="text-sm">Appointments</span>
                  </div>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary-600 rounded mr-2"></div>
                    <span className="text-sm">Startup Support</span>
                  </div>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded mr-2"></div>
                    <span className="text-sm">Infrastructure</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning-600 rounded mr-2"></div>
                    <span className="text-sm">Public Issues</span>
                  </div>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-destructive rounded mr-2"></div>
                    <span className="text-sm">Emergency</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Team Workload</h4>
                <div className="space-y-2">
                  {teamMembers?.map((member) => {
                    // Calculate assigned count based on name
                    const assignedCount = teamPerformance.find(p => p.name === member.name)?.total || 0;
                    
                    return (
                      <div key={member.id} className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs">
                            <span>{member.name}</span>
                            <span>{assignedCount} assigned</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-primary-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(assignedCount / 50 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Team;
