import React from 'react';
import { useAuth } from '../components/Layout/AuthContext';
import AdminDashboard from './admin';
import StudentDashboard from './student';

const RoleBasedQuiz = () => {
    const { user, loading, error } = useAuth();


    if (loading) return <p>Loading...</p>;


    if (error) return <p>{error}</p>;


    if (!user) return <p>You are not logged in. Please log in to access the quiz.</p>;

    return user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
};

export default RoleBasedQuiz;
