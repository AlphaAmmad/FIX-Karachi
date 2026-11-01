import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';

const navByRole = {
  citizen: [
    { to: '/citizen/dashboard', key: 'nav_dashboard' },
    { to: '/citizen/complaints/new', key: 'nav_new_complaint' },
    { to: '/citizen/complaints', key: 'nav_my_complaints' },
    { to: '/citizen/notifications', key: 'nav_notifications', showBadge: true },
  ],
  authority: [
    { to: '/authority/dashboard', key: 'nav_dashboard' },
    { to: '/authority/complaints', key: 'nav_assigned_complaints' },
    { to: '/authority/fake-reports', key: 'nav_fake_reports' },
    { to: '/authority/child-accounts', key: 'nav_child_accounts' },
  ],
  admin: [
    { to: '/admin/dashboard', key: 'nav_dashboard' },
    { to: '/admin/users', key: 'nav_users' },
    { to: '/admin/authorities', key: 'nav_authorities' },
    { to: '/admin/complaints', key: 'nav_complaints' },
    { to: '/admin/escalations', key: 'nav_escalations' },
    { to: '/admin/analytics', key: 'nav_analytics' },
  ],
};

const publicNav = [
  { to: '/', key: 'nav_home' },
  { to: '/about', key: 'nav_about' },
  { to: '/dashboard', key: 'nav_transparency' },
];

export const TopBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const links = isAuthenticated ? (navByRole[user?.role] || publicNav) : publicNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-black text-white">
            FK
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-700">{t('app_name')}</p>
            <p className="text-[11px] text-slate-500">{t('app_tagline')}</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {t(link.key)}
              {/* Notification badge */}
              {link.showBadge && unreadCount > 0 && (
                <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700 md:inline-flex">
                {user?.role}
              </span>
              <button onClick={handleLogout} className="btn-primary text-xs">
                {t('nav_logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-xs">{t('nav_login')}</Link>
              <Link to="/register" className="btn-primary text-xs">{t('nav_register')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};