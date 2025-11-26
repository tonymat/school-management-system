import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import TeachersPage from './pages/TeachersPage';
import StudentsPage from './pages/StudentsPage';
import LogsPage from './pages/LogsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

console.log('✅ App.jsx loaded');


function App() {
    console.log('✅ App component rendering');

    return (
        <AuthProvider>
            <BrowserRouter>
                <div id="app">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route
                                path="/teachers"
                                element={
                                    <ProtectedRoute>
                                        <TeachersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/students"
                                element={
                                    <ProtectedRoute>
                                        <StudentsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/logs" element={<LogsPage />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

console.log('✅ App component defined');

export default App;
