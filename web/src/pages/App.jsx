import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import RegisterChild from './RegisterChild.jsx';
import Dashboard from './Dashboard.jsx';
import Alerts from './Alerts.jsx';
import Settings from './Settings.jsx';
import { useAuthState } from '../services/auth.js';
import Layout from '../components/Layout.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/register"
        element={<ProtectedRoute><Layout><RegisterChild /></Layout></ProtectedRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>}
      />
      <Route
        path="/alerts"
        element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

