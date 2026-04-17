import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { mockCourses } from '../data/mockData';
import CourseCard from '../components/ui/CourseCard';

const enrolledCourses = mockCourses.filter(c => c.progress > 0);

export default function MyCourses() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Courses</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {enrolledCourses.length} courses enrolled
          </p>
        </div>
        <Link to="/catalog" className="btn-primary text-sm">
          <BookOpen size={15} /> Browse More
        </Link>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map(c => (
            <CourseCard key={c.id} course={c} showProgress />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No enrolled courses</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Start learning by enrolling in a course
          </p>
          <Link to="/catalog" className="btn-primary text-sm inline-flex">
            Browse Catalog <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
