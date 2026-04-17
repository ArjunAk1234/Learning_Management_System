import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, GraduationCap, Bell, Search,
  LogOut, Settings, ChevronRight, Menu, X, Flame, Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalog', icon: BookOpen, label: 'Course Catalog' },
  { to: '/my-courses', icon: GraduationCap, label: 'My Courses' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ zIndex: 40 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--border)' }}>
          <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-glow"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="gradient-text">Learnify</span>
            </span>
          </Link>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* User card */}
        {user && (
          <div className="mx-4 my-4 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex items-center gap-1">
                <Flame size={14} color="#f59e0b" />
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{user.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} color="#6366f1" />
                <span className="text-xs font-medium" style={{ color: 'var(--primary-light)' }}>{user.totalPoints.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="px-3 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-secondary)' }}>
            Navigation
          </p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group"
                style={{
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? 'var(--primary-light)' : 'var(--text-secondary)',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium flex-1">{label}</span>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{ color: 'var(--danger)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
