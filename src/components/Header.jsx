import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Users, UserCircle } from 'lucide-react';
import './Header.css';

const Header = ({ onAddClick }) => {
    const location = useLocation();
    const isTeachersPage = location.pathname === '/teachers';
    const isStudentsPage = location.pathname === '/students';

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

                    {(isTeachersPage || isStudentsPage) && onAddClick && (
                        <button className="btn btn-primary" onClick={onAddClick}>
                            + Add {isTeachersPage ? 'Teacher' : 'Student'}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

