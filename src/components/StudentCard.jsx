import React from 'react';
import { Mail, Phone, Edit2, Trash2, User } from 'lucide-react';
import './StudentCard.css';

const StudentCard = ({ student, onEdit, onDelete }) => {
    return (
        <div className="student-card card-interactive">
            <div className="card-photo">
                {student.photoURL ? (
                    <img src={student.photoURL} alt={student.firstName + ' ' + student.lastName} />
                ) : (
                    <div className="photo-placeholder">
                        <User size={48} />
                    </div>
                )}
            </div>

            <div className="card-info">
                <h3>{student.firstName} {student.lastName}</h3>
                <p className="card-role">Class {student.grade} - {student.section}</p>
                <p className="card-id">Roll No: {student.rollNumber}</p>

                <div className="card-contact">
                    <div className="contact-item">
                        <User size={16} />
                        <span>{student.parentName}</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} />
                        <span>{student.parentPhone}</span>
                    </div>
                </div>

                {student.dateOfBirth && (
                    <p className="card-meta">DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
                )}
            </div>

            <div className="card-actions">
                <button
                    className="btn-icon btn-icon-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                    }}
                    title="Edit student"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className="btn-icon btn-icon-danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student);
                    }}
                    title="Delete student"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default StudentCard;

