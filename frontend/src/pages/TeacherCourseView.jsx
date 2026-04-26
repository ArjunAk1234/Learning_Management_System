import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function TeacherCourseView() {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadResources();
  }, [courseId]);

  const loadResources = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/resources`);
      setResources(res.data.resources || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post(`/courses/admin/${courseId}/resource`, formData);
      alert('Uploaded successfully');
      setFile(null);
      loadResources();
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Link to="/teacher/dashboard" className="text-blue-500 block mb-4">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Manage Course: {courseId}</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4 block" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload File</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Course Resources</h2>
        <ul>
          {resources.map(r => (
            <li key={r} className="p-3 border-b">{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
