import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, hasFirebaseConfig } from './config';
import { logActivity } from './activityLogService';

const TEACHERS_COLLECTION = 'teachers';

// Create a new teacher
export const createTeacher = async (teacherData) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const docRef = await addDoc(collection(db, TEACHERS_COLLECTION), {
            ...teacherData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        await logActivity({ entity: 'teacher', entityId: docRef.id, action: 'create', payload: teacherData });
        return { id: docRef.id, ...teacherData };
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};

// Get all teachers with real-time updates
export const getTeachers = (callback) => {
    if (!hasFirebaseConfig) {
        console.warn('Firebase not configured - returning empty teachers list');
        callback([]);
        return () => { }; // Return empty unsubscribe function
    }

    const unsubscribe = onSnapshot(
        collection(db, TEACHERS_COLLECTION),
        (snapshot) => {
            const teachers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(teachers);
        },
        (error) => {
            console.error('Error fetching teachers:', error);
            callback([]);
        }
    );
    return unsubscribe;
};

// Update a teacher
export const updateTeacher = async (teacherId, updates) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const teacherRef = doc(db, TEACHERS_COLLECTION, teacherId);
        await updateDoc(teacherRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        await logActivity({ entity: 'teacher', entityId: teacherId, action: 'update', payload: updates });
        return true;
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
};

// Delete a teacher
export const deleteTeacher = async (teacherId) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        await deleteDoc(doc(db, TEACHERS_COLLECTION, teacherId));
        await logActivity({ entity: 'teacher', entityId: teacherId, action: 'delete' });
        return true;
    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
};

// Upload teacher photo
export const uploadTeacherPhoto = async (file) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const timestamp = Date.now();
        const storageRef = ref(storage, `teachers/${timestamp}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading teacher photo:', error);
        throw error;
    }
};
