import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TeachersPage from './pages/TeachersPage';
import StudentsPage from './pages/StudentsPage';
import LogsPage from './pages/LogsPage';

console.log('✅ App.jsx loaded');


function App() {
    console.log('✅ App component rendering');

    return (
        <BrowserRouter>
            <div id="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/teachers" element={<TeachersPage />} />
                        <Route path="/students" element={<StudentsPage />} />
                        <Route path="/logs" element={<LogsPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

console.log('✅ App component defined');

export default App;
