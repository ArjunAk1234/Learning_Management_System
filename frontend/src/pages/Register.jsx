import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">Student Registration</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded">Register</button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
