import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Editor } from 'pages/editor/Editor';
import { Home } from 'pages/home/Home';
import { Templates } from 'pages/templates/Templates';
import { Login } from 'pages/login/Login';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { Settings } from 'pages/settings/Settings';
import { AuthGuard } from 'app/AuthGuard';
import { Navbar } from 'components/layout/Navbar';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { useAuthStore } from 'store/authStore';
import { authService } from 'services/authService';
import './App.css';
import { Signup } from 'pages/signup/Signup';
import { ClientsPage } from 'pages/clients/ClientsPage';
import { PrivacyPolicy } from 'pages/legal/PrivacyPolicy';
import { TermsOfService } from 'pages/legal/TermsOfService';
import { CookiePolicy } from 'pages/legal/CookiePolicy';
import { CookieBanner } from 'components/ui/CookieBanner';
import { Pricing } from 'pages/pricing/Pricing';
import { ForgotPassword } from 'pages/login/ForgotPassword';
import { ResetPassword } from 'pages/login/ResetPassword';
import { BusinessVerification } from 'pages/settings/KYC';
import { UpgradeCallback } from 'pages/upgrade/UpgradeCallback';
import { fetchWithAuth } from 'services/apiService';

const AppInit = ({ children }: { children: React.ReactNode }) => {
  const { token, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const user = await authService.me();
          if (user.plan === 'free' && user.has_pending_payment) {
            // Fire-and-forget status check to resolve pending payments silently
            fetchWithAuth('/billing/status').catch(() => { });
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [token, logout]);

  if (loading) return null; // Or a global spinner
  return <>{children}</>;
};

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <CookieBanner />
    </>
  );
};

const AdaptiveLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <DashboardLayout /> : <MainLayout />;
};

function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          {/* Routes exclusively with Navbar (Public Pages) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/verification" element={<BusinessVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/upgrade/callback" element={<UpgradeCallback />} />
          </Route>

          {/* Adaptive Routes (Navbar for Guests, Sidebar for Logged in) */}
          <Route element={<AdaptiveLayout />}>
            <Route path="/templates" element={<Templates />} />
          </Route>

          {/* Fully Custom Layouts (Editor is full screen wrapper) */}
          <Route path="/editor/:templateId" element={<Editor />} />

          {/* Protected routes (Strictly requires login, strictly uses DashboardLayout) */}
          <Route element={<AuthGuard />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AppInit>
    </BrowserRouter>
  );
}

export default App;
