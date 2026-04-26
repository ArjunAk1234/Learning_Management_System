import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function StudentDashboard() {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    api.get('/health')
      .then(() => setHealthStatus('Connected ✅'))
      .catch(() => setHealthStatus('Disconnected ❌'));
      
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));

    api.get('/dashboard/student')
      .then(res => setQuizzes(res.data.availableQuizzes || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded">API: {healthStatus}</span>
          <button onClick={logout} className="p-2 text-white bg-red-500 rounded">Logout</button>
        </div>
      </div>
      
      {quizzes.length > 0 && (
        <div className="mb-6 bg-blue-50 p-6 rounded shadow border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4 text-blue-800">📌 Notification Center: Pending Quizzes</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {quizzes.map(q => (
              <div key={q.id} className="p-4 bg-white border border-blue-200 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{q.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Course: <span className="font-semibold">{q.course}</span></p>
                </div>
                <Link to={`/student/quizzes/${q.id}`} className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition">
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Available Courses</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {courses.map(c => (
            <Link key={c.name} to={`/student/courses/${c.name}`} className="p-4 border rounded hover:border-blue-500 transition">
              <h3 className="font-bold text-lg">{c.name}</h3>
              <p className="text-sm text-gray-600 mt-2">View Course</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <Link to="/student/ai-tutor" className="inline-block p-3 mb-2 text-center text-white bg-purple-600 hover:bg-purple-700 rounded shadow transition">
          Talk to AI Tutor
        </Link>
      </div>
    </div>
  );
}
