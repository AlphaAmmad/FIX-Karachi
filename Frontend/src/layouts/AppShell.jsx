import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';

export const AppShell = () => (
  <div className="min-h-screen">
    <TopBar />
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);