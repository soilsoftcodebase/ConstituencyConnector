import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Package2, 
  TrafficCone, 
  Users, 
  AlertTriangle, 
  UsersRound, 
  FileBarChart, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ministerPhoto from '@/assets/minister-photo.png';

const SIDEBAR_WIDTH = "280px";
const SIDEBAR_COLLAPSED_WIDTH = "64px";

interface SidebarProps {
  showSidebar: boolean;
  isCollapsed: boolean;
  onSidebarChange?: (show: boolean) => void;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  showSidebar, 
  isCollapsed, 
  onCollapse,
  onSidebarChange,
  className 
}) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Animation variants for different sidebar states
  const sidebarVariants = {
    visible: {
      width: isMobile 
        ? SIDEBAR_WIDTH 
        : isCollapsed 
          ? SIDEBAR_COLLAPSED_WIDTH 
          : SIDEBAR_WIDTH,
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    hidden: {
      width: 0,
      opacity: 0,
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Toggle button variants
  const toggleButtonVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.2 }
    },
    hidden: {
      opacity: 0,
      x: -20
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="flex-shrink-0 w-5 h-5" /> },
    { path: '/appointments', label: 'Appointment Requests', icon: <UserCheck className="flex-shrink-0 w-5 h-5" />, category: 'appointment' as Category },
    { path: '/startup-support', label: 'Startup Support', icon: <Package2 className="flex-shrink-0 w-5 h-5" />, category: 'startup-support' as Category },
    { path: '/infrastructure', label: 'Infrastructure Issues', icon: <TrafficCone className="flex-shrink-0 w-5 h-5" />, category: 'infrastructure' as Category },
    { path: '/public-issues', label: 'Public Issues', icon: <Users className="flex-shrink-0 w-5 h-5" />, category: 'public-issue' as Category },
    { path: '/emergency', label: 'Emergency Requests', icon: <AlertTriangle className="flex-shrink-0 w-5 h-5" />, category: 'emergency' as Category },
    { path: '/team', label: 'Team Management', icon: <UsersRound className="flex-shrink-0 w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <FileBarChart className="flex-shrink-0 w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="flex-shrink-0 w-5 h-5" /> },
  ];

  // Handle keyboard shortcut for sidebar control
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (!isMobile) {
          if (isCollapsed) {
            onCollapse?.(false); // Expand
          } else if (!showSidebar) {
            onSidebarChange?.(true); // Show
          } else {
            onCollapse?.(true); // Collapse
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMobile, isCollapsed, showSidebar, onCollapse, onSidebarChange]);

  return (
    <>
      {/* Toggle button - shown when sidebar is closed */}
      {!showSidebar && !isMobile && (
        <div className="sidebar-toggle-button"
        >
          <div className="h-full flex items-start">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0
              }}
            >
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "mt-4 bg-white border border-gray-200 rounded-r-lg p-2",
                  "hover:bg-gray-50 hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                )}
                style={{ 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onClick={() => onSidebarChange?.(true)}
                aria-label="Show Sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.aside
            className={cn(
              "fixed md:relative inset-y-0 left-0 z-40 flex flex-col",
              "bg-white border-r border-gray-200 shadow-sm",
              "overflow-hidden",
              className
            )}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className={cn(
                  "flex items-center gap-3 transition-opacity duration-200",
                  isCollapsed && !isMobile && "opacity-0"
                )}>
                  <div className="p-2 bg-primary-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 20h20V8H2v12Z" />
                      <path d="M12 4v16" />
                      <path d="M2 8h20" />
                      <path d="M12 4h8v4" />
                      <path d="M4 4h8v4" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">Constituency Connect</h1>
                </div>
                
                {/* Collapse/Expand button */}
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "md:flex",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    )}
                    onClick={() => onCollapse?.(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {/* Content */}
              <ScrollArea className="flex-grow">
                <div className="flex flex-col p-4">
                  {/* User Profile */}
                  {(!isCollapsed || isMobile) && (
                    <div className="flex flex-col items-center p-4 mb-4 bg-gradient-to-b from-primary-50/80 to-white rounded-lg border border-primary-100/50">
                      <div className="relative w-20 h-20 mb-3">
                        <Avatar className="w-full h-full border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={ministerPhoto}
                            alt="Minister Pemmansani Chandra Shekar"
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                            PCS
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
                      </div>
                      <h2 className="text-base font-semibold text-gray-800 text-center">Pemmansani Chandra Shekar</h2>
                      <p className="text-sm text-primary-600 font-medium">Central Minister, Guntur</p>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = location === item.path;
                      const NavLink: React.ReactElement = (
                        <Link 
                          key={item.path} 
                          href={item.path}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all",
                            "hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                            isActive && "text-primary-700 bg-primary-50",
                            !isActive && "text-gray-600"
                          )}
                        >
                          <span className={cn(
                            "text-gray-500 transition-colors",
                            isActive && "text-primary-600",
                            "group-hover:text-primary-600"
                          )}>
                            {item.icon}
                          </span>
                          {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                        </Link>
                      );

                      return isCollapsed && !isMobile ? (
                        <Tooltip key={item.path}>
                          <TooltipTrigger asChild>
                            {NavLink}
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={20}>
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      ) : NavLink;
                    })}
                  </nav>
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center w-full gap-3 justify-start",
                    "text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  {(!isCollapsed || isMobile) && <span>Log out</span>}
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
