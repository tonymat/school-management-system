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

const STUDENTS_COLLECTION = 'students';

// Create a new student
export const createStudent = async (studentData) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
            ...studentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        await logActivity({ entity: 'student', entityId: docRef.id, action: 'create', payload: studentData });
        return { id: docRef.id, ...studentData };
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

// Get all students with real-time updates
export const getStudents = (callback) => {
    if (!hasFirebaseConfig) {
        console.warn('Firebase not configured - returning empty students list');
        callback([]);
        return () => { }; // Return empty unsubscribe function
    }

    const unsubscribe = onSnapshot(
        collection(db, STUDENTS_COLLECTION),
        (snapshot) => {
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(students);
        },
        (error) => {
            console.error('Error fetching students:', error);
            callback([]);
        }
    );
    return unsubscribe;
};

// Update a student
export const updateStudent = async (studentId, updates) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
        await updateDoc(studentRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        await logActivity({ entity: 'student', entityId: studentId, action: 'update', payload: updates });
        return true;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// Delete a student
export const deleteStudent = async (studentId) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
        await logActivity({ entity: 'student', entityId: studentId, action: 'delete' });
        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};

// Upload student photo
export const uploadStudentPhoto = async (file) => {
    if (!hasFirebaseConfig) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const timestamp = Date.now();
        const storageRef = ref(storage, `students/${timestamp}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading student photo:', error);
        throw error;
    }
};
