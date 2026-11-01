import React, { Suspense, lazy, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { AppShell } from './layouts/AppShell';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoadingScreen } from './components/common/LoadingScreen';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const PublicDashboardPage = lazy(() => import('./pages/public/PublicDashboardPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));

const CitizenDashboardPage = lazy(() => import('./pages/citizen/CitizenDashboardPage'));
const CitizenCreateComplaintPage = lazy(() => import('./pages/citizen/CitizenCreateComplaintPage'));
const CitizenMyComplaintsPage = lazy(() => import('./pages/citizen/CitizenMyComplaintsPage'));
const CitizenComplaintDetailsPage = lazy(() => import('./pages/citizen/CitizenComplaintDetailsPage'));
const CitizenNotificationsPage = lazy(() => import('./pages/citizen/CitizenNotificationsPage'));
const CitizenEscalationsPage = lazy(() => import('./pages/citizen/CitizenEscalationsPage'));
const CitizenProfilePage = lazy(() => import('./pages/citizen/CitizenProfilePage'));

const AuthorityDashboardPage = lazy(() => import('./pages/authority/AuthorityDashboardPage'));
const AssignedComplaintsPage = lazy(() => import('./pages/authority/AssignedComplaintsPage'));
const AuthorityComplaintDetailsPage = lazy(() => import('./pages/authority/AuthorityComplaintDetailsPage'));
const UpdateStatusPage = lazy(() => import('./pages/authority/UpdateStatusPage'));
const ResolutionUploadPage = lazy(() => import('./pages/authority/ResolutionUploadPage'));
const FakeComplaintReportsPage = lazy(() => import('./pages/authority/FakeComplaintReportsPage'));
const ChildAuthorityAccountsPage = lazy(() => import('./pages/authority/ChildAuthorityAccountsPage'));
const AuthorityNotificationsPage = lazy(() => import('./pages/authority/AuthorityNotificationsPage'));

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const UsersManagementPage = lazy(() => import('./pages/admin/UsersManagementPage'));
const AuthoritiesManagementPage = lazy(() => import('./pages/admin/AuthoritiesManagementPage'));
const ComplaintsManagementPage = lazy(() => import('./pages/admin/ComplaintsManagementPage'));
const AdminEscalationsPage = lazy(() => import('./pages/admin/AdminEscalationsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminFakeReportsPage = lazy(() => import('./pages/admin/AdminFakeReportsPage'));

const App = () => {
  const { user, ready } = useAuth();
  const { language } = useLanguage();

  const roleHome = useMemo(() => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'authority') return '/authority/dashboard';
    return '/citizen/dashboard';
  }, [user]);

  if (!ready) return <LoadingScreen fullScreen />;

  return (
    <Suspense fallback={<LoadingScreen fullScreen />}>
      <Routes>
        {/* Public routes wrapped in AppShell */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<PublicDashboardPage />} />
          <Route path="/login" element={user ? <Navigate to={roleHome} replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to={roleHome} replace /> : <RegisterPage />} />
        </Route>

        {/* Citizen routes — wrapped in DashboardLayout for sidebar */}
        <Route element={<ProtectedRoute roles={['citizen']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
            <Route path="/citizen/complaints/new" element={<CitizenCreateComplaintPage />} />
            <Route path="/citizen/complaints" element={<CitizenMyComplaintsPage />} />
            <Route path="/citizen/complaints/:id" element={<CitizenComplaintDetailsPage />} />
            <Route path="/citizen/notifications" element={<CitizenNotificationsPage />} />
            <Route path="/citizen/escalations" element={<CitizenEscalationsPage />} />
            <Route path="/citizen/profile" element={<CitizenProfilePage />} />
          </Route>
        </Route>

        {/* Authority routes — wrapped in DashboardLayout for sidebar */}
        <Route element={<ProtectedRoute roles={['authority']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/authority/dashboard" element={<AuthorityDashboardPage />} />
            <Route path="/authority/complaints" element={<AssignedComplaintsPage />} />
            <Route path="/authority/complaints/:id" element={<AuthorityComplaintDetailsPage />} />
            <Route path="/authority/complaints/:id/update" element={<UpdateStatusPage />} />
            <Route path="/authority/complaints/:id/resolution" element={<ResolutionUploadPage />} />
            <Route path="/authority/fake-reports" element={<FakeComplaintReportsPage />} />
            <Route path="/authority/child-accounts" element={<ChildAuthorityAccountsPage />} />
            <Route path="/authority/notifications" element={<AuthorityNotificationsPage />} />
          </Route>
        </Route>

        {/* Admin routes — wrapped in DashboardLayout for sidebar */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersManagementPage />} />
            <Route path="/admin/authorities" element={<AuthoritiesManagementPage />} />
            <Route path="/admin/complaints" element={<ComplaintsManagementPage />} />
            <Route path="/admin/fake-reports" element={<AdminFakeReportsPage />} />
            <Route path="/admin/escalations" element={<AdminEscalationsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
