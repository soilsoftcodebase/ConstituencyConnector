import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FileBarChart, Download, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/hooks/use-app-store';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  CategoryChartData, 
  StatusChartData,
  StatsData,
  Category,
  TimePeriod
} from '@/types';
import { getDefaultCategoryData, getDefaultStatusData, getDefaultStatsData } from '@/lib/data';

const Reports = () => {
  const { selectedTimePeriod, setSelectedTimePeriod } = useAppStore();
  const [regionFilter, setRegionFilter] = useState('all');

  // Fetch statistics for the selected time period
  const { data: statsData } = useQuery<StatsData>({
    queryKey: ['/api/stats', selectedTimePeriod],
  });

  const { data: categoryData } = useQuery<CategoryChartData[]>({
    queryKey: ['/api/stats/categories', selectedTimePeriod],
  });
  
  const { data: statusData } = useQuery<StatusChartData[]>({
    queryKey: ['/api/stats/statuses', selectedTimePeriod],
  });

  // Set page title
  useEffect(() => {
    document.title = "Reports - Constituency Connect";
  }, []);

  // Use default data if API data is not available
  const stats = statsData || getDefaultStatsData();
  const categories = categoryData || getDefaultCategoryData();
  const statuses = statusData || getDefaultStatusData();

  // Monthly trend data (mock data for demonstration)
  const monthlyTrendData = [
    { name: 'Jan', appointments: 12, startup: 8, infrastructure: 15, public: 10, emergency: 5 },
    { name: 'Feb', appointments: 15, startup: 10, infrastructure: 12, public: 8, emergency: 7 },
    { name: 'Mar', appointments: 18, startup: 12, infrastructure: 10, public: 12, emergency: 6 },
    { name: 'Apr', appointments: 20, startup: 15, infrastructure: 14, public: 15, emergency: 8 },
    { name: 'May', appointments: 22, startup: 20, infrastructure: 16, public: 18, emergency: 10 },
    { name: 'Jun', appointments: 25, startup: 18, infrastructure: 20, public: 15, emergency: 9 },
    { name: 'Jul', appointments: 30, startup: 22, infrastructure: 25, public: 22, emergency: 12 }
  ];

  // Resolution rate data (mock data for demonstration)
  const resolutionRateData = [
    { name: 'Week 1', rate: 65 },
    { name: 'Week 2', rate: 70 },
    { name: 'Week 3', rate: 75 },
    { name: 'Week 4', rate: 82 },
    { name: 'Week 5', rate: 78 },
    { name: 'Week 6', rate: 85 },
    { name: 'Week 7', rate: 88 },
    { name: 'Week 8', rate: 90 }
  ];

  // Constituency distribution data
  const districtData = [
    { name: 'Guntur West', value: 24 },
    { name: 'Guntur East', value: 22 },
    { name: 'Mangalagiri', value: 18 },
    { name: 'Tenali', value: 16 },
    { name: 'Ponnur', value: 12 },
    { name: 'Tadikonda', value: 10 },
    { name: 'Prathipadu', value: 8 }
  ];

  const COLORS = ['#1a56db', '#7e3af2', '#0694a2', '#ff5a1f', '#e02424'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const handleDownloadReport = () => {
    alert('Report download functionality would be implemented here');
  };

  const formatTimePeriod = (period: TimePeriod): string => {
    switch(period) {
      case 'today': return 'Today';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      case 'last-quarter': return 'Last Quarter';
      case 'this-year': return 'This Year';
      case 'custom': return 'Custom Range';
      default: return period;
    }
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
            <FileBarChart className="w-6 h-6 mr-2 text-primary-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Analyze constituent request data and track performance metrics</p>
        </motion.div>
        <motion.div 
          className="mt-4 md:mt-0 flex space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Select value={selectedTimePeriod} onValueChange={(value) => setSelectedTimePeriod(value as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <div className="text-xs text-success-600 mt-2 flex items-center">
                <span className="i-lucide-arrow-up-right h-3 w-3 mr-1"></span>
                {stats.totalRequestsChange}% from previous period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <div className="text-xs text-destructive mt-2 flex items-center">
                <span className="i-lucide-arrow-up-right h-3 w-3 mr-1"></span>
                {stats.pendingRequestsChange}% from previous period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.completedRequests}</div>
              <p className="text-sm text-gray-500">Completed Requests</p>
              <div className="text-xs text-success-600 mt-2 flex items-center">
                <span className="i-lucide-arrow-up-right h-3 w-3 mr-1"></span>
                {stats.completedRequestsChange}% from previous period
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{Math.round((stats.completedRequests / stats.totalRequests) * 100)}%</div>
              <p className="text-sm text-gray-500">Resolution Rate</p>
              <div className="text-xs text-success-600 mt-2 flex items-center">
                <span className="i-lucide-arrow-up-right h-3 w-3 mr-1"></span>
                5% from previous period
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search in reports..."
                  className="pl-9 w-[200px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Request Distribution by Category</CardTitle>
                  <CardDescription>
                    {formatTimePeriod(selectedTimePeriod)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} requests`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Request Status Distribution</CardTitle>
                  <CardDescription>
                    {formatTimePeriod(selectedTimePeriod)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statuses}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={120}
                        />
                        <Tooltip formatter={(value: number) => [`${value} requests`, 'Count']} />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          name="Number of Requests"
                          animationDuration={750} 
                          animationBegin={250}
                        >
                          {statuses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Request Trends</CardTitle>
                <CardDescription>
                  Request volume by category over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="appointments" 
                        stroke="#1a56db" 
                        activeDot={{ r: 8 }} 
                        name="Appointments"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="startup" 
                        stroke="#7e3af2" 
                        name="Startup Support"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="infrastructure" 
                        stroke="#0694a2" 
                        name="Infrastructure"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="public" 
                        stroke="#ff5a1f" 
                        name="Public Issues"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="emergency" 
                        stroke="#e02424" 
                        name="Emergency"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Resolution Rate Trend</CardTitle>
                  <CardDescription>
                    Weekly resolution rate percentage
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={resolutionRateData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value: number) => [`${value}%`, 'Resolution Rate']} />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#1a56db" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">District Distribution</CardTitle>
                  <CardDescription>
                    Request distribution by district
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={districtData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value} requests`, 'Count']} />
                        <Bar 
                          dataKey="value" 
                          name="Requests"
                          fill="#1a56db"
                          animationDuration={750}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Analysis</CardTitle>
                <CardDescription>
                  Detailed analysis of requests by category for {formatTimePeriod(selectedTimePeriod)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Loop through each category and show stats */}
                  {categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <h3 className="text-lg font-medium">{category.name}</h3>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-medium">{category.value}</span>
                          <span className="text-sm text-gray-500 ml-2">requests</span>
                          <span className="text-sm ml-2 px-2 py-0.5 rounded-full bg-gray-100">
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                      
                      {/* Mock data for status breakdown within each category */}
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm font-medium">New</div>
                          <div className="text-lg font-semibold">{Math.round(category.value * 0.2)}</div>
                          <div className="text-xs text-gray-500">20%</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm font-medium">In Progress</div>
                          <div className="text-lg font-semibold">{Math.round(category.value * 0.3)}</div>
                          <div className="text-xs text-gray-500">30%</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm font-medium">Under Review</div>
                          <div className="text-lg font-semibold">{Math.round(category.value * 0.1)}</div>
                          <div className="text-xs text-gray-500">10%</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm font-medium">Awaiting</div>
                          <div className="text-lg font-semibold">{Math.round(category.value * 0.1)}</div>
                          <div className="text-xs text-gray-500">10%</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm font-medium">Resolved</div>
                          <div className="text-lg font-semibold">{Math.round(category.value * 0.3)}</div>
                          <div className="text-xs text-gray-500">30%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regional" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <CardTitle>Regional Analysis</CardTitle>
                    <CardDescription>
                      Request distribution across different regions
                    </CardDescription>
                  </div>
                  <Select 
                    value={regionFilter} 
                    onValueChange={setRegionFilter}
                  >
                    <SelectTrigger className="w-[180px] mt-2 md:mt-0">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="secunderabad">Secunderabad</SelectItem>
                      <SelectItem value="warangal">Warangal</SelectItem>
                      <SelectItem value="nizamabad">Nizamabad</SelectItem>
                      <SelectItem value="medak">Medak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileBarChart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Regional Map Visualization</h3>
                    <p className="text-gray-500 mt-1">
                      Interactive geographic map would be displayed here
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {districtData.map((district, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-4 text-center">
                        <h3 className="font-medium text-sm">{district.name}</h3>
                        <div className="text-xl font-bold mt-1">{district.value}</div>
                        <div className="text-xs text-gray-500">requests</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Monthly Trend Analysis</CardTitle>
                  <CardDescription>
                    Request volume trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrendData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#1a56db" 
                          activeDot={{ r: 8 }} 
                          name="Appointments"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="startup" 
                          stroke="#7e3af2" 
                          name="Startup Support"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="infrastructure" 
                          stroke="#0694a2" 
                          name="Infrastructure"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="public" 
                          stroke="#ff5a1f" 
                          name="Public Issues"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="emergency" 
                          stroke="#e02424" 
                          name="Emergency"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Response Time Analysis</CardTitle>
                  <CardDescription>
                    Average response time by category (days)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Appointments', days: 3.2 },
                          { name: 'Startup Support', days: 5.7 },
                          { name: 'Infrastructure', days: 8.5 },
                          { name: 'Public Issues', days: 4.3 },
                          { name: 'Emergency', days: 1.1 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(1)} days`, 'Response Time']} />
                        <Bar dataKey="days" fill="#1a56db" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Team Member Performance Trends</CardTitle>
                <CardDescription>
                  Request handling trends by team member
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: 'Week 1', meera: 10, raj: 8, nitin: 12, aisha: 15 },
                        { name: 'Week 2', meera: 12, raj: 10, nitin: 14, aisha: 13 },
                        { name: 'Week 3', meera: 15, raj: 12, nitin: 15, aisha: 18 },
                        { name: 'Week 4', meera: 18, raj: 15, nitin: 16, aisha: 20 },
                        { name: 'Week 5', meera: 20, raj: 18, nitin: 17, aisha: 22 },
                        { name: 'Week 6', meera: 22, raj: 20, nitin: 18, aisha: 25 },
                        { name: 'Week 7', meera: 25, raj: 22, nitin: 21, aisha: 27 },
                        { name: 'Week 8', meera: 28, raj: 25, nitin: 24, aisha: 30 }
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="meera" 
                        stroke="#1a56db" 
                        name="Meera Joshi" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="raj" 
                        stroke="#7e3af2" 
                        name="Raj Khanna" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nitin" 
                        stroke="#0694a2" 
                        name="Nitin Gupta" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="aisha" 
                        stroke="#ff5a1f" 
                        name="Aisha Khan" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Reports;
