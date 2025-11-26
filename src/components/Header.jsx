import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, UserCircle, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ onAddClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const isTeachersPage = location.pathname === '/teachers';
    const isStudentsPage = location.pathname === '/students';
    const isLogsPage = location.pathname === '/logs';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        <GraduationCap size={32} />
                        <span>School Management</span>
                    </Link>

                    <nav className="header-nav">
                        <Link
                            to="/teachers"
                            className={`nav-link ${isTeachersPage ? 'active' : ''}`}
                        >
                            <Users size={20} />
                            <span>Teachers</span>
                        </Link>
                        <Link
                            to="/students"
                            className={`nav-link ${isStudentsPage ? 'active' : ''}`}
                        >
                            <UserCircle size={20} />
                            <span>Students</span>
                        </Link>
                    </nav>

                    <div className="header-actions">
                        {currentUser ? (
                            <>
                                {(isTeachersPage || isStudentsPage) && onAddClick && (
                                    <button className="btn btn-primary" onClick={onAddClick}>
                                        + Add {isTeachersPage ? 'Teacher' : 'Student'}
                                    </button>
                                )}
                                <div className="user-info">
                                    <span className="user-email">{currentUser.email}</span>
                                    <button onClick={handleLogout} className="btn-icon" title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary">
                                <LogIn size={18} style={{ marginRight: '8px' }} />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

