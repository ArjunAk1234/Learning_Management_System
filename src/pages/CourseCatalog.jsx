import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { mockCourses, categories } from '../data/mockData';
import CourseCard from '../components/ui/CourseCard';

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = mockCourses.filter(c => {
    const matchQ = !query || c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchLvl = selectedLevel === 'All' || c.level === selectedLevel;
    return matchQ && matchCat && matchLvl;
  });

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSearchParams({});
  };

  const hasFilters = query || selectedCategory !== 'All' || selectedLevel !== 'All';

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Course Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Explore {mockCourses.length} courses across {categories.length - 1} categories
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search courses, instructors, or topics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field pl-9"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-secondary)' }}>
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`btn-ghost px-4 gap-2 ${showFilters ? 'border-indigo-500' : ''}`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasFilters && (
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: 'var(--primary)', color: 'white' }}>
              {[query, selectedCategory !== 'All', selectedLevel !== 'All'].filter(Boolean).length}
            </span>
          )}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-ghost px-4 gap-2 text-sm"
            style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="glass rounded-xl p-5 flex flex-wrap gap-6">
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedCategory === c ? 'var(--primary)' : 'var(--surface-3)',
                    color: selectedCategory === c ? 'white' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: selectedCategory === c ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Level
            </p>
            <div className="flex gap-2">
              {levels.map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLevel(l)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedLevel === l ? 'var(--primary)' : 'var(--surface-3)',
                    color: selectedLevel === l ? 'white' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: selectedLevel === l ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category pills (quick filter) */}
      {!showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: selectedCategory === c ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--surface-2)',
                color: selectedCategory === c ? 'white' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: selectedCategory === c ? 'var(--primary)' : 'var(--border)',
                boxShadow: selectedCategory === c ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span> courses
        {hasFilters && <span> matching your filters</span>}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} showProgress={c.progress > 0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <Search size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No courses found</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try different keywords or clear your filters</p>
          <button onClick={clearFilters} className="btn-primary mt-4 text-sm">Clear Filters</button>
        </div>
      )}
    </div>
  );
}
