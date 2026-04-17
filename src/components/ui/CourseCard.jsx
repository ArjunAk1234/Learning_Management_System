import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, ChevronRight } from 'lucide-react';

const levelColors = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
};

export default function CourseCard({ course, showProgress = false }) {
  const initials = course.title.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="glass card-hover rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div
          className="h-40 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${course.color}33, ${course.color}11)`,
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}99)` }}
          >
            {initials}
          </div>
          {/* Category badge top-right */}
          <span className="absolute top-3 right-3 badge" style={{ background: `${course.color}33`, color: course.color }}>
            {course.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title + level */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
              {course.title}
            </h3>
            <span className={`badge ${levelColors[course.level] || 'badge-primary'} shrink-0`}>
              {course.level}
            </span>
          </div>

          {/* Instructor */}
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {course.instructor}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {course.tags.map(tag => (
              <span key={tag} className="badge badge-primary text-xs">{tag}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-auto pt-3"
            style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{course.rating}</span>
              <span>({course.ratingCount})</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Clock size={12} />
              {course.duration}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <BookOpen size={12} />
              {course.lessons} lessons
            </div>
          </div>

          {/* Progress bar (if enrolled) */}
          {showProgress && course.progress > 0 && (
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                <span>Progress</span>
                <span style={{ color: 'var(--primary-light)' }}>{course.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-1 text-xs font-semibold mt-1"
            style={{ color: 'var(--primary-light)' }}>
            {showProgress && course.progress > 0 ? 'Continue Learning' : 'View Course'}
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
