import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icon = type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <div className="toast-icon">{icon}</div>
                <div className="toast-message">{message}</div>
                <button className="toast-close" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;

