import { Route, Switch } from "wouter";
import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import StartupSupport from "@/pages/startup-support";
import Infrastructure from "@/pages/infrastructure";
import PublicIssues from "@/pages/public-issues";
import Emergency from "@/pages/emergency";
import Team from "@/pages/team";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useMobileDetect } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import RequestDetails from "@/components/modals/request-details";
import AssignRequest from "@/components/modals/assign-request";
import CallRequestor from "@/components/modals/call-requestor";
import NewRequest from "@/components/modals/new-request";

function App() {
  const { isMobile } = useMobileDetect();
  
  // Use a single state to track sidebar mode
  const [sidebarState, setSidebarState] = useState({
    isVisible: !isMobile,
    isCollapsed: false,
  });

  useEffect(() => {
    setSidebarState(prev => ({
      ...prev,
      isVisible: !isMobile,
    }));
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile, simply toggle visibility
      setSidebarState(prev => ({
        isCollapsed: false,
        isVisible: !prev.isVisible,
      }));
    } else {
      // On desktop:
      // If sidebar is hidden -> show expanded
      // If sidebar is expanded -> collapse
      // If sidebar is collapsed -> hide
      setSidebarState(prev => {
        if (!prev.isVisible) {
          return { isVisible: true, isCollapsed: false };
        } else if (!prev.isCollapsed) {
          return { isVisible: true, isCollapsed: true };
        } else {
          return { isVisible: false, isCollapsed: false };
        }
      });
    }
  };

  const handleSidebarChange = (show: boolean) => {
    setSidebarState({
      isVisible: show,
      isCollapsed: false,  // Always expand when showing
    });
  };

  const handleCollapse = (collapsed: boolean) => {
    setSidebarState(prev => ({
      isVisible: true,  // Always visible when collapsing/expanding
      isCollapsed: collapsed,
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="flex h-full w-full relative">
        <Sidebar 
          showSidebar={sidebarState.isVisible} 
          isCollapsed={sidebarState.isCollapsed}
          onCollapse={handleCollapse}
          onSidebarChange={handleSidebarChange} 
        />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="relative flex-1 overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <AnimatePresence mode="wait">
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/appointments" component={Appointments} />
                  <Route path="/startup-support" component={StartupSupport} />
                  <Route path="/infrastructure" component={Infrastructure} />
                  <Route path="/public-issues" component={PublicIssues} />
                  <Route path="/emergency" component={Emergency} />
                  <Route path="/team" component={Team} />
                  <Route path="/reports" component={Reports} />
                  <Route path="/settings" component={Settings} />
                  <Route component={NotFound} />
                </Switch>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <RequestDetails />
      {useAppStore(state => state.currentModal) === 'assign-request' && (
        <AssignRequest 
          requestId={useAppStore(state => state.selectedRequestId) as number}
          currentAssigneeId={null}
          onClose={() => useAppStore.getState().setCurrentModal(null)}
          onSuccess={() => {}}
        />
      )}
      <CallRequestor />
      <NewRequest />
    </div>
    </div>
  );
}

export default App;
