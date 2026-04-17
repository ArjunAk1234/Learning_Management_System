import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchVal.trim())}`);
      setShowSearch(false);
      setSearchVal('');
    }
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30"
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            <GraduationCap size={14} color="white" />
          </div>
          <span className="font-bold gradient-text">Learnify</span>
        </div>
      </div>

      {/* Center: search (desktop) */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
      </form>

      {/* Right: icons + avatar */}
      <div className="flex items-center gap-2">
        {/* Mobile search toggle */}
        <button
          onClick={() => setShowSearch(s => !s)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--primary)' }} />
        </button>

        {/* Avatar */}
        {user && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 p-3 md:hidden"
          style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Search courses..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="input-field flex-1 text-sm"
            />
            <button type="submit" className="btn-primary py-2 px-4 text-sm">Go</button>
          </form>
        </div>
      )}
    </header>
  );
}
