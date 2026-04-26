import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function StudentCourseView() {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [courseQuizzes, setCourseQuizzes] = useState([]);

  useEffect(() => {
    api.get(`/courses/${courseId}/resources`)
      .then(res => setResources(res.data.resources || []))
      .catch(err => console.error(err));

    api.get('/dashboard/student')
      .then(res => {
          const allQuizzes = res.data.availableQuizzes || [];
          setCourseQuizzes(allQuizzes.filter(q => q.course === courseId));
      })
      .catch(err => console.error(err));
  }, [courseId]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Link to="/student/dashboard" className="text-blue-500 block mb-4">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Course: {courseId}</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Course Resources</h2>
        <ul>
          {resources.length === 0 ? <p className="text-gray-500">No resources available.</p> : null}
          {resources.map(r => (
            <li key={r} className="p-3 border-b flex justify-between items-center">
              <span>{r}</span>
              <a href={`http://localhost:5000/api/courses/${courseId}/resource/${r}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Download</a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">AI Study Tools</h2>
        
        <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Available Quizzes</h3>
            {courseQuizzes.length === 0 ? (
                <p className="text-sm text-gray-500">No AI quizzes published for this course yet.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {courseQuizzes.map(q => (
                        <Link key={q.id} to={`/student/quizzes/${q.id}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
                            Take: {q.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>

        <Link to={`/student/ai-tutor`} className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition">Actively Ask AI Tutor</Link>
      </div>
    </div>
  );
}
