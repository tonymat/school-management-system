import React from 'react';
import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from '../firebase/studentService';
import './StudentsPage.css';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = getStudents((studentsData) => {
            setStudents(studentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter students based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredStudents(students);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = students.filter(student =>
            student.firstName?.toLowerCase().includes(query) ||
            student.lastName?.toLowerCase().includes(query) ||
            student.grade?.toLowerCase().includes(query) ||
            student.section?.toLowerCase().includes(query) ||
            student.rollNumber?.toLowerCase().includes(query) ||
            student.parentName?.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    }, [searchQuery, students]);

    const handleAdd = () => {
        setEditingStudent(null);
        setIsFormOpen(true);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    const handleDelete = (student) => {
        setDeleteConfirm(student);
    };

    const confirmDelete = async () => {
        try {
            await deleteStudent(deleteConfirm.id);
            setToast({ message: 'Student deleted successfully', type: 'success' });
            setDeleteConfirm(null);
        } catch (error) {
            setToast({ message: 'Failed to delete student', type: 'error' });
        }
    };

    const handleSubmit = async (studentData) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, studentData);
                setToast({ message: 'Student updated successfully', type: 'success' });
            } else {
                await createStudent(studentData);
                setToast({ message: 'Student added successfully', type: 'success' });
            }
            setIsFormOpen(false);
            setEditingStudent(null);
        } catch (error) {
            setToast({ message: 'Failed to save student', type: 'error' });
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <div className="students-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Students</h1>
                        <p>Manage student profiles and information</p>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleAdd}>
                        <UserPlus size={20} />
                        Add Student
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, class, section, roll number, or parent name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Students Grid */}
                {filteredStudents.length > 0 ? (
                    <div className="students-grid grid grid-cols-4">
                        {filteredStudents.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎓</div>
                        <h3>No students found</h3>
                        <p>
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Get started by adding your first student'}
                        </p>
                        {!searchQuery && (
                            <button className="btn btn-primary mt-lg" onClick={handleAdd}>
                                <UserPlus size={20} />
                                Add First Student
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
                    setEditingStudent(null);
                }}
                title={editingStudent ? 'Edit Student' : 'Add New Student'}
            >
                <StudentForm
                    student={editingStudent}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingStudent(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Delete Student"
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

export default StudentsPage;

