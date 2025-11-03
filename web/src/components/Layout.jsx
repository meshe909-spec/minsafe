import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const linkClass = (to) => `block px-3 py-2 rounded ${pathname === to ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-4 space-y-2">
        <div className="text-xl font-semibold mb-4">MiniSafe</div>
        <nav className="space-y-1">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/register" className={linkClass('/register')}>Register Child</Link>
          <Link to="/alerts" className={linkClass('/alerts')}>Alerts</Link>
          <Link to="/settings" className={linkClass('/settings')}>Settings</Link>
        </nav>
      </aside>
      <div className="grid grid-rows-[56px_1fr] min-h-screen">
        <Navbar />
        <main className="p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

