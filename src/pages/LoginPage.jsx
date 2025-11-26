import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Users, UserCircle, ArrowLeft } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [role, setRole] = useState(null); // 'teacher' | 'student' | null
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if redirected from a specific page or passed a role
        const from = location.state?.from?.pathname;
        const passedRole = location.state?.role;

        if (passedRole) {
            setRole(passedRole);
        } else if (from) {
            if (from.startsWith('/teachers')) {
                setRole('teacher');
            } else if (from.startsWith('/students')) {
                setRole('student');
            }
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // Redirect based on selected role
            if (role === 'teacher') {
                navigate('/teachers');
            } else if (role === 'student') {
                navigate('/students');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to sign in. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setError('');
    };

    const handleBack = () => {
        setRole(null);
        setError('');
        setEmail('');
        setPassword('');
    };

    // Role Selection View
    if (!role) {
        return (
            <div className="auth-page">
                <div className="auth-card role-selection-card">
                    <div className="auth-header">
                        <h2 className="auth-title">Welcome</h2>
                        <p className="auth-subtitle">Please select your login type</p>
                    </div>

                    <div className="role-buttons">
                        <button
                            className="role-button teacher-role"
                            onClick={() => handleRoleSelect('teacher')}
                        >
                            <div className="role-icon-wrapper">
                                <Users size={32} />
                            </div>
                            <div className="role-info">
                                <h3>Teacher Login</h3>
                                <p>Manage students and classes</p>
                            </div>
                        </button>

                        <button
                            className="role-button student-role"
                            onClick={() => handleRoleSelect('student')}
                        >
                            <div className="role-icon-wrapper">
                                <UserCircle size={32} />
                            </div>
                            <div className="role-info">
                                <h3>Student Login</h3>
                                <p>View profile and records</p>
                            </div>
                        </button>
                    </div>

                    <div className="auth-footer">
                        Don't have an account?
                        <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Login Form View
    return (
        <div className="auth-page">
            <div className="auth-card">
                <button onClick={handleBack} className="back-button">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="auth-header">
                    {role === 'teacher' ? (
                        <Users size={48} className="auth-icon" />
                    ) : (
                        <UserCircle size={48} className="auth-icon" />
                    )}
                    <h2 className="auth-title">
                        {role === 'teacher' ? 'Teacher Login' : 'Student Login'}
                    </h2>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="form-input-wrapper">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrapper">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-button" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
