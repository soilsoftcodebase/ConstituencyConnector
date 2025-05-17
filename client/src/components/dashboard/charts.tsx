import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { CategoryChartData, StatusChartData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CalendarDays } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/hooks/use-app-store';
import { useQuery } from '@tanstack/react-query';

export const RequestAnalytics = () => {
  const { selectedTimePeriod, setSelectedTimePeriod } = useAppStore();
  
  const { data: categoryData } = useQuery<CategoryChartData[]>({
    queryKey: ['/api/stats/categories', selectedTimePeriod],
  });
  
  const { data: statusData } = useQuery<StatusChartData[]>({
    queryKey: ['/api/stats/statuses', selectedTimePeriod],
  });

  const categoryChartData = useMemo(() => {
    return categoryData || [
      { name: 'Appointments', value: 52, percentage: 35, color: '#1a56db' },
      { name: 'Startup Support', value: 22, percentage: 15, color: '#7e3af2' },
      { name: 'Infrastructure', value: 37, percentage: 25, color: '#0694a2' },
      { name: 'Public Issues', value: 22, percentage: 15, color: '#ff5a1f' },
      { name: 'Emergency', value: 14, percentage: 10, color: '#e02424' }
    ];
  }, [categoryData]);

  const statusChartData = useMemo(() => {
    return statusData || [
      { name: 'New', count: 28, percentage: 19, color: '#9ca3af' },
      { name: 'In Progress', count: 42, percentage: 29, color: '#3b82f6' },
      { name: 'Under Review', count: 14, percentage: 10, color: '#8b5cf6' },
      { name: 'Awaiting Feedback', count: 18, percentage: 12, color: '#06b6d4' },
      { name: 'Resolved', count: 45, percentage: 30, color: '#10b981' }
    ];
  }, [statusData]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-[12px] font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const handleTimePeriodChange = (value: string) => {
    setSelectedTimePeriod(value as any);
  };

  const tooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '8px',
    padding: '12px 16px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <motion.div
      className="col-span-1 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-lg font-semibold">Request Analytics</CardTitle>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Select value={selectedTimePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger className="h-9 w-[180px]">
                <CalendarDays className="w-4 h-4 mr-2" />
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
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Category Chart */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm font-medium text-gray-800">Requests by Category</div>
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={110}
                      innerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={750}
                      animationBegin={0}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value} requests`, 'Count']} 
                      contentStyle={tooltipStyle}
                      cursor={{ fill: 'transparent' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categoryChartData.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-2 group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {item.name} ({item.percentage}%)
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Status Chart */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm font-medium text-gray-800">Requests by Status</div>
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusChartData}
                    layout="vertical"
                    margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                    barSize={30}
                  >
                    <XAxis 
                      type="number" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => value.toString()}
                      tickCount={5}
                      padding={{ left: 0, right: 0 }}
                    />
                    <YAxis 
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ 
                        fill: '#374151', 
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      width={100}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={tooltipStyle} 
                      cursor={{ fill: 'rgba(236, 237, 239, 0.4)' }}
                      formatter={(value: any) => [`${value} requests`, 'Count']}
                      labelStyle={{ color: '#374151', fontWeight: 500 }}
                    />
                    <Bar 
                      dataKey="count" 
                      animationDuration={750} 
                      animationBegin={250}
                      radius={[4, 4, 4, 4]}
                      label={{ 
                        position: 'right',
                        fill: '#6B7280',
                        fontSize: 12,
                        formatter: (value: any) => value,
                        dx: 5
                      }}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {statusChartData.map((status, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div 
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm text-gray-700 font-medium truncate">
                          {status.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium flex-shrink-0">
                        {status.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: status.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${status.percentage}%` }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.6 + (index * 0.1),
                          ease: 'easeOut'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RequestAnalytics;
