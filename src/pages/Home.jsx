import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCircle, TrendingUp, BookOpen } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <div className="container">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>School Management System</h1>
                        <p>Streamline your school administration with our comprehensive management platform</p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="features-grid">
                    <Link to="/teachers" className="feature-card card">
                        <div className="feature-icon">
                            <Users size={48} />
                        </div>
                        <h3>Teacher Management</h3>
                        <p>Manage teacher profiles, subjects, and departments with ease</p>
                        <div className="feature-cta">
                            View Teachers →
                        </div>
                    </Link>

                    <Link to="/students" className="feature-card card">
                        <div className="feature-icon feature-icon-secondary">
                            <UserCircle size={48} />
                        </div>
                        <h3>Student Management</h3>
                        <p>Track student information, classes, and parent contacts</p>
                        <div className="feature-cta">
                            View Students →
                        </div>
                    </Link>
                </section>

                {/* Quick Stats */}
                <section className="quick-stats">
                    <div className="stat-card card">
                        <div className="stat-icon">
                            <TrendingUp size={32} />
                        </div>
                        <div className="stat-info">
                            <h4>Efficient Management</h4>
                            <p>Real-time updates and synchronization</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">
                            <BookOpen size={32} />
                        </div>
                        <div className="stat-info">
                            <h4>Easy Access</h4>
                            <p>Organized data with search and filters</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;

