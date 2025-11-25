import React from 'react';
import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import TeacherCard from '../components/TeacherCard';
import TeacherForm from '../components/TeacherForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from '../firebase/teacherService';
import './TeachersPage.css';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = getTeachers((teachersData) => {
            setTeachers(teachersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter teachers based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredTeachers(teachers);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = teachers.filter(teacher =>
            teacher.firstName?.toLowerCase().includes(query) ||
            teacher.lastName?.toLowerCase().includes(query) ||
            teacher.subject?.toLowerCase().includes(query) ||
            teacher.department?.toLowerCase().includes(query) ||
            teacher.email?.toLowerCase().includes(query)
        );
        setFilteredTeachers(filtered);
    }, [searchQuery, teachers]);

    const handleAdd = () => {
        setEditingTeacher(null);
        setIsFormOpen(true);
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setIsFormOpen(true);
    };

    const handleDelete = (teacher) => {
        setDeleteConfirm(teacher);
    };

    const confirmDelete = async () => {
        try {
            await deleteTeacher(deleteConfirm.id);
            setToast({ message: 'Teacher deleted successfully', type: 'success' });
            setDeleteConfirm(null);
        } catch (error) {
            setToast({ message: 'Failed to delete teacher', type: 'error' });
        }
    };

    const handleSubmit = async (teacherData) => {
        try {
            if (editingTeacher) {
                await updateTeacher(editingTeacher.id, teacherData);
                setToast({ message: 'Teacher updated successfully', type: 'success' });
            } else {
                await createTeacher(teacherData);
                setToast({ message: 'Teacher added successfully', type: 'success' });
            }
            setIsFormOpen(false);
            setEditingTeacher(null);
        } catch (error) {
            setToast({ message: 'Failed to save teacher', type: 'error' });
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading teachers...</p>
            </div>
        );
    }

    return (
        <div className="teachers-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Teachers</h1>
                        <p>Manage teacher profiles and information</p>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleAdd}>
                        <UserPlus size={20} />
                        Add Teacher
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, subject, department, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Teachers Grid */}
                {filteredTeachers.length > 0 ? (
                    <div className="teachers-grid grid grid-cols-4">
                        {filteredTeachers.map(teacher => (
                            <TeacherCard
                                key={teacher.id}
                                teacher={teacher}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <h3>No teachers found</h3>
                        <p>
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Get started by adding your first teacher'}
                        </p>
                        {!searchQuery && (
                            <button className="btn btn-primary mt-lg" onClick={handleAdd}>
                                <UserPlus size={20} />
                                Add First Teacher
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <Modal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTeacher(null);
                }}
                title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            >
                <TeacherForm
                    teacher={editingTeacher}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingTeacher(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Delete Teacher"
                message={`Are you sure you want to delete ${deleteConfirm?.firstName} ${deleteConfirm?.lastName}? This action cannot be undone.`}
            />

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default TeachersPage;

