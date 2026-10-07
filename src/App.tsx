import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DiscoverPage } from './pages/DiscoverPage.tsx';
import { CreatorProfilePage } from './pages/CreatorProfilePage.tsx';
import { BrandDashboardPage } from './pages/brand/BrandDashboardPage.tsx';
import { BrandBriefsListPage } from './pages/brand/BrandBriefsListPage.tsx';
import { BrandBriefBuilderPage } from './pages/brand/BrandBriefBuilderPage.tsx';
import { BrandBriefDetailPage } from './pages/brand/BrandBriefDetailPage.tsx';
import { BrandEngagementsPage } from './pages/brand/BrandEngagementsPage.tsx';
import { CreatorDashboardPage } from './pages/creator/CreatorDashboardPage.tsx';
import { CreatorProfileEditPage } from './pages/creator/CreatorProfileEditPage.tsx';
import { CreatorPortfolioManagePage } from './pages/creator/CreatorPortfolioManagePage.tsx';
import { CreatorEngagementsPage } from './pages/creator/CreatorEngagementsPage.tsx';
import { UserRole } from './types/index.ts';

function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard'} replace />;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/creators/:id" element={<CreatorProfilePage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route
            path="/brand/dashboard"
            element={<ProtectedRoute allowedRoles={['brand'] as UserRole[]}><BrandDashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/brand/briefs"
            element={<ProtectedRoute allowedRoles={['brand'] as UserRole[]}><BrandBriefsListPage /></ProtectedRoute>}
          />
          <Route
            path="/brand/briefs/new"
            element={<ProtectedRoute allowedRoles={['brand'] as UserRole[]}><BrandBriefBuilderPage /></ProtectedRoute>}
          />
          <Route
            path="/brand/briefs/:id"
            element={<ProtectedRoute allowedRoles={['brand'] as UserRole[]}><BrandBriefDetailPage /></ProtectedRoute>}
          />
          <Route
            path="/brand/engagements"
            element={<ProtectedRoute allowedRoles={['brand'] as UserRole[]}><BrandEngagementsPage /></ProtectedRoute>}
          />

          <Route
            path="/creator/dashboard"
            element={<ProtectedRoute allowedRoles={['creator'] as UserRole[]}><CreatorDashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/creator/profile"
            element={<ProtectedRoute allowedRoles={['creator'] as UserRole[]}><CreatorProfileEditPage /></ProtectedRoute>}
          />
          <Route
            path="/creator/portfolio"
            element={<ProtectedRoute allowedRoles={['creator'] as UserRole[]}><CreatorPortfolioManagePage /></ProtectedRoute>}
          />
          <Route
            path="/creator/engagements"
            element={<ProtectedRoute allowedRoles={['creator'] as UserRole[]}><CreatorEngagementsPage /></ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
