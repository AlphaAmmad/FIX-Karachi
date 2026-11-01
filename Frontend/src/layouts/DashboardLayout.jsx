import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import Button from '../components/common/Button';
import LanguageToggle from '../components/layout/LanguageToggle';
import NotificationDrawer from '../components/notifications/NotificationDrawer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

const sidebarLinks = {
  citizen: [
    { to: '/citizen/dashboard', key: 'nav_dashboard' },
    { to: '/citizen/complaints/new', key: 'nav_create_complaint' },
    { to: '/citizen/complaints', key: 'nav_my_complaints' },
    { to: '/citizen/escalations', key: 'nav_escalations' },
    { to: '/citizen/profile', key: 'nav_profile' },
  ],
  authority: [
    { to: '/authority/dashboard', key: 'nav_dashboard' },
    { to: '/authority/complaints', key: 'nav_assigned_complaints' },
    { to: '/authority/fake-reports', key: 'nav_fake_reports' },
    { to: '/authority/child-accounts', key: 'nav_child_accounts' },
    { to: '/authority/notifications', key: 'nav_notifications' },
  ],
  admin: [
    { to: '/admin/dashboard', key: 'nav_dashboard' },
    { to: '/admin/users', key: 'nav_users' },
    { to: '/admin/authorities', key: 'nav_authorities' },
    { to: '/admin/complaints', key: 'nav_complaints' },
    { to: '/admin/fake-reports', key: 'nav_fake_reports' },
    { to: '/admin/escalations', key: 'nav_escalations' },
    { to: '/admin/analytics', key: 'nav_analytics' },
    { to: '/admin/notifications', key: 'nav_notifications' },
    { to: '/admin/settings', key: 'nav_settings' },
  ],
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const location = useLocation();
  const role = user?.role || 'citizen';
  const links = sidebarLinks[role] || sidebarLinks.citizen;
  const roleHome = role === 'admin' ? '/admin/dashboard' : role === 'authority' ? '/authority/dashboard' : '/citizen/dashboard';

  const isLinkActive = (to) => {
    const path = location.pathname;
    if (to === '/citizen/complaints') {
      return path.startsWith('/citizen/complaints') && path !== '/citizen/complaints/new';
    }
    if (to === '/authority/complaints') {
      return path.startsWith('/authority/complaints') && !path.includes('/fake-reports') && !path.includes('/child-accounts') && !path.includes('/notifications');
    }
    if (to === '/admin/complaints') {
      return path.startsWith('/admin/complaints');
    }
    return path === to;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-ink-950 px-5 py-6 text-white shrink-0">
        <Link to={roleHome} className="mb-8 block">
          <Logo />
        </Link>
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isLinkActive(item.to)
                  ? 'bg-white text-ink-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-3xl bg-white/10 p-4 border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {t(`login_role_${role}`)}
          </p>
          <p className="mt-1 font-semibold text-white truncate">
            {user?.fullName || user?.name || 'User'}
          </p>
          <div className="mt-4 flex gap-2">
            <LanguageToggle variant="ghost" className="flex-1 text-xs py-1.5" />
            <Button variant="ghost" className="flex-1 text-xs py-1.5" onClick={handleLogout}>
              {t('nav_logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            
            {/* Mobile Left: Menu Toggle & Title */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-900 shadow-sm transition hover:bg-slate-50"
                aria-label="Open navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to={roleHome} className="font-display text-lg font-bold text-ink-900">
                {t('app_name')}
              </Link>
            </div>

            {/* Desktop Left: Breadcrumb role indicator */}
            <div className="hidden lg:block">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                {t(`login_role_${role}`)}
              </span>
            </div>

            {/* Right Quick Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Notification Button (Icon Only) */}
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <Button 
                variant="soft" 
                className="lg:hidden border border-slate-200 bg-white text-ink-900 hover:bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0" 
                onClick={handleLogout}
              >
                {t('nav_logout')}
              </Button>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Navigation Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Navigation Drawer Panel */}
      <div
        className={`fixed inset-y-0 start-0 z-50 w-72 bg-ink-950 p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to={roleHome} onClick={() => setMobileMenuOpen(false)}>
            <Logo />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isLinkActive(item.to)
                  ? 'bg-white text-ink-950'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-white/10 p-4 border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {t(`login_role_${role}`)}
          </p>
          <p className="mt-1 font-semibold text-white truncate">
            {user?.fullName || user?.name || 'User'}
          </p>
          <div className="mt-4 flex gap-2">
            <LanguageToggle variant="ghost" className="flex-1 text-xs py-1.5" />
            <Button variant="ghost" className="flex-1 text-xs py-1.5" onClick={handleLogout}>
              {t('nav_logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications Side Drawer */}
      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};

export default DashboardLayout;