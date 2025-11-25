import React from 'react';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadTeacherPhoto } from '../firebase/teacherService';
import './TeacherForm.css';

const TeacherForm = ({ teacher, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(teacher || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        department: '',
        qualifications: '',
        experience: '',
        employeeId: '',
        joinDate: '',
        bio: '',
        photoURL: ''
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(teacher?.photoURL || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
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
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';

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

            // Upload new photo if selected
            if (photoFile) {
                photoURL = await uploadTeacherPhoto(photoFile);
            }

            await onSubmit({ ...formData, photoURL });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save teacher. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="teacher-form" onSubmit={handleSubmit}>
            {/* Photo Upload */}
            <div className="form-group">
                <label className="form-label">Photo</label>
                <div className="photo-upload">
                    {photoPreview ? (
                        <div className="photo-preview">
                            <img src={photoPreview} alt="Teacher preview" />
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

            {/* Contact Fields */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="teacher@school.com"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+1 234 567 8900"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
            </div>

            {/* Subject & Department */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Mathematics, Physics, etc."
                    />
                    {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Department *</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Science, Arts, etc."
                    />
                    {errors.department && <span className="form-error">{errors.department}</span>}
                </div>
            </div>

            {/* Qualifications & Experience */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Qualifications</label>
                    <input
                        type="text"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="M.Sc, B.Ed, etc."
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="5"
                        min="0"
                    />
                </div>
            </div>

            {/* Employee ID & Join Date */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="EMP001"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Join Date</label>
                    <input
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Brief description about the teacher..."
                    rows="4"
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
                    {loading ? 'Saving...' : teacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
            </div>
        </form>
    );
};

export default TeacherForm;

