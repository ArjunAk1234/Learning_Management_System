import { Link } from 'react-router-dom';
import {
  TrendingUp, BookOpen, Clock, CheckCircle2, Calendar,
  ArrowRight, Flame, Star, AlertCircle, Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockDeadlines } from '../data/mockData';
import CourseCard from '../components/ui/CourseCard';

const enrolledCourses = mockCourses.filter(c => c.progress > 0);

export default function Dashboard() {
  const { user } = useAuth();
  const overallProgress = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in-up">
      {/* Hero greeting */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(14,165,233,0.15))', border: '1px solid rgba(99,102,241,0.25)' }}
      >
        {/* Decorative */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="absolute right-32 bottom-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--secondary), transparent)' }} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--primary-light)' }}>
              👋 Welcome back,
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {user?.name}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              You're on a <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{user?.streak}-day</span> streak 🔥 Keep it up!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass rounded-xl p-4 text-center min-w-[80px]">
              <Flame size={20} color="#f59e0b" className="mx-auto mb-1" />
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.streak}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Day Streak</p>
            </div>
            <div className="glass rounded-xl p-4 text-center min-w-[80px]">
              <Star size={20} color="#6366f1" className="mx-auto mb-1" />
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{(user?.totalPoints / 1000).toFixed(1)}K</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Points</p>
            </div>
            <div className="glass rounded-xl p-4 text-center min-w-[80px]">
              <CheckCircle2 size={20} color="#10b981" className="mx-auto mb-1" />
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.completedCourses}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'var(--primary)' },
          { icon: TrendingUp, label: 'Avg. Progress', value: `${overallProgress}%`, color: 'var(--secondary)' },
          { icon: Clock, label: 'Hours Learned', value: '48h', color: 'var(--accent)' },
          { icon: Calendar, label: 'Deadlines', value: mockDeadlines.length, color: 'var(--success)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}22` }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Continue Learning</h2>
            <Link to="/my-courses" className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: 'var(--primary-light)' }}>
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledCourses.map(c => (
              <CourseCard key={c.id} course={c} showProgress />
            ))}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-5">
          {/* Upcoming deadlines */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} color="var(--accent)" />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {mockDeadlines.map(d => (
                <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                  style={{ background: d.urgent ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${d.urgent ? 'rgba(239,68,68,0.2)' : 'var(--border)'}` }}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0`}
                    style={{ background: d.urgent ? 'var(--danger)' : 'var(--success)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{d.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{d.course}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: d.urgent ? 'var(--danger)' : 'var(--text-secondary)' }}>
                      Due: {d.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick start */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Jump Back In</h3>
            {enrolledCourses.slice(0, 2).map(c => (
              <Link key={c.id} to={`/course/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors hover:bg-white/5 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}88)` }}>
                  <Play size={14} color="white" fill="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                  <div className="progress-bar mt-1.5">
                    <div className="progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.progress}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
