import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import LoginPage, { getUserRole, clearUserData } from "@/pages/LoginPage";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductDetails from "@/pages/ProductDetails";

function Router() {
  const [userRole, setUserRole] = useState<"company" | "customer" | "admin" | null>(null);
  const [, setLocation] = useLocation();

  // Check sessionStorage for user role on mount and when storage changes
  useEffect(() => {
    const checkUserRole = () => {
      const role = getUserRole();
      setUserRole(role);
    };

    // Check on mount
    checkUserRole();

    // Listen for storage changes (in case user logs in from another tab)
    window.addEventListener('storage', checkUserRole);
    
    // Custom event for same-tab updates
    window.addEventListener('userRoleChanged', checkUserRole);

    return () => {
      window.removeEventListener('storage', checkUserRole);
      window.removeEventListener('userRoleChanged', checkUserRole);
    };
  }, []);

  const handleLogin = (role: "company" | "customer" | "admin") => {
    setUserRole(role);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userRoleChanged'));
    
    // Redirect to appropriate dashboard
    if (role === "company") {
      setLocation("/company");
    } else if (role === "customer") {
      setLocation("/customer");
    } else if (role === "admin") {
      setLocation("/admin");
    }
  };

  const handleLogout = () => {
    // Clear sessionStorage
    clearUserData();
    
    // Clear React Query cache
    queryClient.clear();
    
    // Update state
    setUserRole(null);
    
    // Dispatch event
    window.dispatchEvent(new Event('userRoleChanged'));
    
    // Redirect to login
    setLocation("/login");
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role={userRole} onLogout={handleLogout} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4 flex-shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              <Switch>
                <Route path="/login" component={() => <LoginPage onLogin={handleLogin} />} />
                
                <Route path="/company">
                  {userRole === "company" ? <CompanyDashboard /> : <NotFound />}
                </Route>
                
                <Route path="/customer">
                  {userRole === "customer" ? <CustomerDashboard /> : <NotFound />}
                </Route>
                
                <Route path="/admin">
                  {userRole === "admin" ? <AdminDashboard /> : <NotFound />}
                </Route>
                
                <Route path="/product/:id" component={ProductDetails} />
                
                <Route path="/">
                  {userRole === "company" && <CompanyDashboard />}
                  {userRole === "customer" && <CustomerDashboard />}
                  {userRole === "admin" && <AdminDashboard />}
                </Route>
                
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}