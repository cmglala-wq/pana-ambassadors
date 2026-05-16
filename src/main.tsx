import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { isAdminHost, ADMIN_URL } from './lib/hosts';

const ADMIN = isAdminHost();

function RedirectToAdmin() {
  useEffect(() => { window.location.href = ADMIN_URL + '/'; }, []);
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-6 h-6 mx-auto rounded-full border-2 border-pana-lime border-t-transparent animate-spin mb-3"/>
        <div className="text-sm text-white/70">Llevándote al admin console…</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        {ADMIN ? (
          // ADMIN-ONLY DEPLOY: every path renders the Admin Console.
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace/>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/admin" replace/>} />
          </Routes>
        ) : (
          // PUBLIC SITE: landing + login + embajador portal (mock data, no CF Access).
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<RedirectToAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
