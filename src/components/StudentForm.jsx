import React from 'react';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadStudentPhoto } from '../firebase/studentService';
import './StudentForm.css';

const StudentForm = ({ student, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(student || {
        firstName: '',
        lastName: '',
        rollNumber: '',
        grade: '',
        section: '',
        dateOfBirth: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        admissionDate: '',
        photoURL: ''
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(student?.photoURL || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
        if (!formData.grade.trim()) newErrors.grade = 'Class/Grade is required';
        if (!formData.section.trim()) newErrors.section = 'Section is required';
        if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
        if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            let photoURL = formData.photoURL;

            if (photoFile) {
                photoURL = await uploadStudentPhoto(photoFile);
            }

            await onSubmit({ ...formData, photoURL });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="student-form" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="photo-upload">
                    {photoPreview ? (
                        <div className="photo-preview">
                            <img src={photoPreview} alt="Student preview" />
                            <button
                                type="button"
                                className="remove-photo"
                                onClick={removePhoto}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <label className="photo-upload-btn">
                            <Upload size={24} />
                            <span>Upload Photo</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                hidden
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Name Fields */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter first name"
                    />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter last name"
                    />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
            </div>

            {/* Student Info */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Roll Number *</label>
                    <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="001"
                    />
                    {errors.rollNumber && <span className="form-error">{errors.rollNumber}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
            </div>

            {/* Class & Section */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Class/Grade *</label>
                    <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="10, 11, 12, etc."
                    />
                    {errors.grade && <span className="form-error">{errors.grade}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Section *</label>
                    <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="A, B, C, etc."
                    />
                    {errors.section && <span className="form-error">{errors.section}</span>}
                </div>
            </div>

            {/* Parent Information */}
            <div className="form-group">
                <label className="form-label">Parent/Guardian Name *</label>
                <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter parent/guardian name"
                />
                {errors.parentName && <span className="form-error">{errors.parentName}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Parent Email</label>
                    <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="parent@email.com"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Parent Phone *</label>
                    <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+1 234 567 8900"
                    />
                    {errors.parentPhone && <span className="form-error">{errors.parentPhone}</span>}
                </div>
            </div>

            {/* Address */}
            <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Student's address..."
                    rows="3"
                />
            </div>

            {/* Admission Date */}
            <div className="form-group">
                <label className="form-label">Admission Date</label>
                <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
                </button>
            </div>
        </form>
    );
};

export default StudentForm;

