import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourseCreate from './pages/TeacherCourseCreate';
import TeacherCourseView from './pages/TeacherCourseView';
import TeacherQuizGenerator from './pages/TeacherQuizGenerator';

import StudentDashboard from './pages/StudentDashboard';
import StudentCourseView from './pages/StudentCourseView';
import StudentQuiz from './pages/StudentQuiz';
import StudentTutor from './pages/StudentTutor';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, userRole } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/courses/new" element={<ProtectedRoute allowedRole="teacher"><TeacherCourseCreate /></ProtectedRoute>} />
      <Route path="/teacher/courses/:courseId" element={<ProtectedRoute allowedRole="teacher"><TeacherCourseView /></ProtectedRoute>} />
      <Route path="/teacher/courses/:courseId/ai-quiz-generator" element={<ProtectedRoute allowedRole="teacher"><TeacherQuizGenerator /></ProtectedRoute>} />
      
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId" element={<ProtectedRoute allowedRole="student"><StudentCourseView /></ProtectedRoute>} />
      <Route path="/student/quizzes/:quizId" element={<ProtectedRoute allowedRole="student"><StudentQuiz /></ProtectedRoute>} />
      <Route path="/student/ai-tutor" element={<ProtectedRoute allowedRole="student"><StudentTutor /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
