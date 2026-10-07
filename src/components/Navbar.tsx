import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  Search,
  FileText,
  Briefcase,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Film,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLoginAsDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState<boolean>(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'creator' ? '/creator/dashboard' : '/brand/dashboard';
  };

  const getBriefsPath = () => {
    if (user?.role === 'brand') return '/brand/briefs';
    return '/discover';
  };

  const getEngagementsPath = () => {
    if (!user) return '/login';
    return user.role === 'creator' ? '/creator/engagements' : '/brand/engagements';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-blue-700 transition-colors">
                G
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Gen<span className="text-blue-600">Hire</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 ml-1"></span>
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/discover"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  isActive('/discover')
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 text-blue-500" />
                <span>Discover</span>
              </Link>

              {user?.role === 'brand' && (
                <>
                  <Link
                    to="/brand/briefs"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                      isActive('/brand/briefs')
                        ? 'text-blue-600 bg-blue-50/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>Briefs</span>
                  </Link>
                  <Link
                    to="/brand/briefs/new"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>AI Brief Builder</span>
                  </Link>
                </>
              )}

              {user && (
                <Link
                  to={getEngagementsPath()}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                    isActive(getEngagementsPath())
                      ? 'text-blue-600 bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  <span>Engagements</span>
                </Link>
              )}

              {user?.role === 'creator' && (
                <Link
                  to="/creator/portfolio"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                    isActive('/creator/portfolio')
                      ? 'text-blue-600 bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Film className="w-4 h-4 text-red-500" />
                  <span>My Portfolio</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Login Pill for Hackathon Judges */}
            {!user && (
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center space-x-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>1-Click Demo Accounts</span>
                </button>
                {demoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <button
                      onClick={async () => {
                        setDemoMenuOpen(false);
                        await quickLoginAsDemo('brand');
                        navigate('/brand/dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col"
                    >
                      <span className="text-blue-600 font-bold">Log in as Brand (Kavita)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Create briefs, match & invite creators</span>
                    </button>
                    <button
                      onClick={async () => {
                        setDemoMenuOpen(false);
                        await quickLoginAsDemo('creator');
                        navigate('/creator/dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex flex-col border-t border-slate-100"
                    >
                      <span className="text-blue-600 font-bold">Log in as Creator (Aarav)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Manage video portfolio & engagements</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dashboard</span>
                  <span className="ml-1 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Discover Creators
          </Link>
          {user?.role === 'brand' && (
            <>
              <Link
                to="/brand/briefs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Campaign Briefs
              </Link>
              <Link
                to="/brand/briefs/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg"
              >
                ✨ AI Brief Builder
              </Link>
            </>
          )}
          {user && (
            <Link
              to={getEngagementsPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Active Engagements
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2 px-3 text-center text-xs font-bold text-white bg-blue-600 rounded-lg"
                >
                  Go to {user.role === 'creator' ? 'Creator' : 'Brand'} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-2 px-3 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await quickLoginAsDemo('brand');
                      navigate('/brand/dashboard');
                    }}
                    className="py-1.5 px-2 text-center text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    Demo Brand
                  </button>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await quickLoginAsDemo('creator');
                      navigate('/creator/dashboard');
                    }}
                    className="py-1.5 px-2 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
                  >
                    Demo Creator
                  </button>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-blue-600 border border-blue-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
