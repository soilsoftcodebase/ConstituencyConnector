import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  secondary?: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  iconBgColor,
  iconTextColor,
  secondary
}: StatCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      className="relative overflow-hidden bg-white rounded-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <motion.div 
            className={`flex-shrink-0 p-3 rounded-lg ${iconBgColor}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            <div className={`text-xl ${iconTextColor}`}>{icon}</div>
          </motion.div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-600 truncate">{title}</dt>
              <dd className="flex items-baseline mt-2">
                <motion.div 
                  className="text-2xl font-semibold text-gray-900"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {value}
                </motion.div>
                {change !== 0 && (
                  <motion.div 
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      isPositive ? 'text-success-600' : 'text-destructive'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {isPositive ? (
                      <ArrowUpIcon className="w-3 h-3 mr-0.5 flex-shrink-0" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-0.5 flex-shrink-0" />
                    )}
                    <span className="sr-only">
                      {isPositive ? 'Increased' : 'Decreased'} by
                    </span>
                    {Math.abs(change)}%
                  </motion.div>
                )}
                {secondary && (
                  <motion.div 
                    className="ml-2 flex items-baseline text-sm font-semibold text-destructive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {secondary}
                  </motion.div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {/* Add a subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
          opacity: 0.4
        }}
      />
    </motion.div>
  );
};

export default StatCard;
