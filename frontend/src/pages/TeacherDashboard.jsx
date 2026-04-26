import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function TeacherDashboard() {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    api.get('/health')
      .then(() => setHealthStatus('Connected ✅'))
      .catch(() => setHealthStatus('Disconnected ❌'));
      
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded">API: {healthStatus}</span>
          <button onClick={logout} className="p-2 text-white bg-red-500 rounded">Logout</button>
        </div>
      </div>
      
      <div className="mb-6">
        <Link to="/teacher/courses/new" className="px-4 py-2 text-white bg-green-600 rounded">Create New Course</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c.name} className="p-6 bg-white rounded shadow">
            <h2 className="mb-4 text-xl font-bold">{c.name}</h2>
            <div className="flex flex-col gap-2">
              <Link to={`/teacher/courses/${c.name}`} className="text-blue-600 hover:underline">Manage Resources</Link>
              <Link to={`/teacher/courses/${c.name}/ai-quiz-generator`} className="text-blue-600 hover:underline">AI Quiz Generator</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
