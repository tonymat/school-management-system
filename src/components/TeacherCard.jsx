import React from 'react';
import { Mail, Phone, Edit2, Trash2, User } from 'lucide-react';
import './TeacherCard.css';

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
    return (
        <div className="teacher-card card-interactive">
            <div className="card-photo">
                {teacher.photoURL ? (
                    <img src={teacher.photoURL} alt={teacher.firstName + ' ' + teacher.lastName} />
                ) : (
                    <div className="photo-placeholder">
                        <User size={48} />
                    </div>
                )}
            </div>

            <div className="card-info">
                <h3>{teacher.firstName} {teacher.lastName}</h3>
                <p className="card-role">{teacher.subject} • {teacher.department}</p>

                <div className="card-contact">
                    <div className="contact-item">
                        <Mail size={16} />
                        <span>{teacher.email}</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} />
                        <span>{teacher.phone}</span>
                    </div>
                </div>

                {teacher.experience && (
                    <p className="card-meta">{teacher.experience} years experience</p>
                )}
            </div>

            <div className="card-actions">
                <button
                    className="btn-icon btn-icon-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(teacher);
                    }}
                    title="Edit teacher"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className="btn-icon btn-icon-danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(teacher);
                    }}
                    title="Delete teacher"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TeacherCard;

