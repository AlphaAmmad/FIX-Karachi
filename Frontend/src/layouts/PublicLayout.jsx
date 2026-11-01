import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import Button from '../components/common/Button';
import LanguageToggle from '../components/layout/LanguageToggle';
import { ROUTES } from '../config/constants';

const PublicLayout = () => React.createElement('div', { className: 'min-h-screen bg-hero text-white' }, [
  React.createElement('header', { key: 'header', className: 'sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' }, React.createElement('div', { className: 'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8' }, [
    React.createElement(Link, { key: 'brand', to: ROUTES.HOME }, React.createElement(Logo)),
    React.createElement('nav', { key: 'nav', className: 'hidden items-center gap-6 md:flex' }, [
      React.createElement(Link, { key: 'home', to: ROUTES.HOME, className: 'text-sm font-semibold text-slate-300 hover:text-white' }, 'Home'),
      React.createElement(Link, { key: 'about', to: ROUTES.ABOUT, className: 'text-sm font-semibold text-slate-300 hover:text-white' }, 'About'),
      React.createElement(Link, { key: 'dashboard', to: ROUTES.TRANSPARENCY, className: 'text-sm font-semibold text-slate-300 hover:text-white' }, 'Transparency'),
    ]),
    React.createElement('div', { key: 'actions', className: 'flex items-center gap-2' }, [
      React.createElement(LanguageToggle, { key: 'lang' }),
      React.createElement(Button, { key: 'login', as: Link, to: ROUTES.LOGIN, variant: 'ghost' }, 'Login'),
      React.createElement(Button, { key: 'register', as: Link, to: ROUTES.REGISTER, variant: 'accent' }, 'Register'),
    ]),
  ])),
  React.createElement('main', { key: 'main', className: 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8' }, React.createElement(Outlet)),
]);

export default PublicLayout;