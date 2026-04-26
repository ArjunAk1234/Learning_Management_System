import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function TeacherCourseCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses/admin/create', { name, notes: [description] });
      navigate('/teacher/dashboard');
    } catch (err) {
      alert('Failed to create course');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 shadow rounded">
        <label className="block mb-2">Course Name</label>
        <input type="text" className="w-full p-2 border mb-4 rounded" value={name} onChange={e => setName(e.target.value)} required />
        <label className="block mb-2">Description</label>
        <textarea className="w-full p-2 border mb-4 rounded" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
