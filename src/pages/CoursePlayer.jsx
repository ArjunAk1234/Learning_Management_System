import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play, CheckCircle2, Lock, ChevronDown, ChevronUp,
  Star, Users, Clock, BookOpen, ArrowLeft,
  FileText, HelpCircle, ChevronRight, PanelRightClose, PanelRightOpen,
} from 'lucide-react';
import { mockCourses, mockModules } from '../data/mockData';

const typeIcon = { video: Play, quiz: HelpCircle, assignment: FileText };

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === Number(id));
  const [activeLesson, setActiveLesson] = useState(mockModules[1]?.lessons[0]);
  const [expandedModules, setExpandedModules] = useState([1, 2]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Course not found</p>
        <Link to="/catalog" className="btn-primary inline-flex mt-4">Back to Catalog</Link>
      </div>
    );
  }

  const toggleModule = (id) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const totalLessons = mockModules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = mockModules.flatMap(m => m.lessons).filter(l => l.completed).length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="max-w-full -m-4 md:-m-6 fade-in-up">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors shrink-0"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-sm md:text-base truncate" style={{ color: 'var(--text-primary)' }}>
              {course.title}
            </h1>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {activeLesson?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          {/* Progress pill */}
          <div className="hidden md:flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <div className="progress-bar w-24">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--primary-light)' }}>{progress}%</span>
          </div>
          <button
            onClick={() => setSidebarOpen(s => !s)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={sidebarOpen ? 'Hide playlist' : 'Show playlist'}
          >
            {sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex" style={{ minHeight: 'calc(100vh - 128px)' }}>
        {/* Content area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:mr-80' : ''}`}>
          {/* Video player */}
          <div className="relative w-full" style={{ background: '#000', aspectRatio: '16/9', maxHeight: '520px' }}>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: `linear-gradient(135deg, ${course.color}22, #000)` }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 pulse-glow"
                style={{ background: 'rgba(99,102,241,0.25)', border: '2px solid var(--primary)' }}
              >
                <Play size={32} fill="white" color="white" className="ml-2" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white mb-1">{activeLesson?.title}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{activeLesson?.duration}</p>
              </div>
            </div>
            {/* Fake video controls bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <div className="flex items-center gap-3">
                <button className="p-1 hover:opacity-80 transition-opacity">
                  <Play size={16} fill="white" color="white" />
                </button>
                <div className="flex-1 h-1 rounded-full cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <div className="h-full rounded-full w-1/3"
                    style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
                </div>
                <span className="text-xs text-white/70">0:00 / {activeLesson?.duration}</span>
              </div>
            </div>
          </div>

          {/* Content below video */}
          <div className="p-5 md:p-8 space-y-6">
            {/* Lesson title & info */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {activeLesson?.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1"><Clock size={13} /> {activeLesson?.duration}</span>
                    <span className="flex items-center gap-1"><Play size={13} /> Video Lesson</span>
                  </div>
                </div>
                <button className="btn-primary text-sm">
                  <CheckCircle2 size={15} /> Mark Complete
                </button>
              </div>
            </div>

            {/* Course meta */}
            <div className="glass rounded-xl p-5 flex flex-wrap gap-6">
              {[
                { icon: Star, value: `${course.rating} (${course.ratingCount} reviews)`, color: '#f59e0b' },
                { icon: Users, value: `${course.enrolled.toLocaleString()} enrolled`, color: 'var(--secondary)' },
                { icon: BookOpen, value: `${totalLessons} lessons`, color: 'var(--primary-light)' },
                { icon: Clock, value: course.duration, color: 'var(--success)' },
              ].map(({ icon: Icon, value, color }) => (
                <div key={value} className="flex items-center gap-2">
                  <Icon size={15} color={color} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>About this course</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {course.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags.map(t => (
                <span key={t} className="badge badge-primary">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lesson Sidebar */}
        {sidebarOpen && (
          <aside
            className="w-80 border-l flex-col overflow-y-auto hidden md:flex fixed right-0"
            style={{
              top: '128px',
              bottom: 0,
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Course Content
              </p>
              <div className="progress-bar mb-1">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {completedLessons}/{totalLessons} lessons completed ({progress}%)
              </p>
            </div>

            {/* Modules */}
            <div className="flex-1 overflow-y-auto">
              {mockModules.map(module => {
                const isExpanded = expandedModules.includes(module.id);
                const moduleDone = module.lessons.filter(l => l.completed).length;
                return (
                  <div key={module.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* Module header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {module.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {moduleDone}/{module.lessons.length} completed
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={15} color="var(--text-secondary)" /> : <ChevronDown size={15} color="var(--text-secondary)" />}
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div>
                        {module.lessons.map(lesson => {
                          const isActive = activeLesson?.id === lesson.id;
                          const Icon = typeIcon[lesson.type] || Play;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                              style={{
                                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                              }}
                              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                              {/* Status icon */}
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  background: lesson.completed
                                    ? 'rgba(16,185,129,0.15)'
                                    : isActive ? 'rgba(99,102,241,0.2)' : 'var(--surface-3)',
                                }}
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 size={14} color="var(--success)" />
                                ) : lesson.type !== 'video' ? (
                                  <Icon size={12} color={isActive ? 'var(--primary-light)' : 'var(--text-secondary)'} />
                                ) : (
                                  <Play size={10} fill={isActive ? 'var(--primary-light)' : 'var(--text-secondary)'}
                                    color={isActive ? 'var(--primary-light)' : 'var(--text-secondary)'} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate"
                                  style={{ color: isActive ? 'var(--primary-light)' : lesson.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {lesson.duration}
                                </p>
                              </div>
                              {isActive && <ChevronRight size={13} color="var(--primary-light)" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
