import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { auth, hasFirebaseConfig, db } from './config';
import { setDoc, doc } from 'firebase/firestore';
import { logActivity } from './activityLogService';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User credential
 */
export const signUp = async (email, password, role = null) => {
    if (!hasFirebaseConfig || !auth) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        // If a role is provided, store it in Firestore
        if (role && db) {
            try {
                await setDoc(doc(db, 'users', uid), {
                    email: userCredential.user.email,
                    role,
                    createdAt: new Date().toISOString()
                });
            } catch (e) {
                console.error('Failed to save user role:', e);
            }
        }
        // Log the signup activity with role info
        await logActivity({
            entity: 'auth',
            entityId: uid,
            action: 'signup',
            payload: { email: userCredential.user.email, role }
        });
        return userCredential.user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User credential
 */
export const signIn = async (email, password) => {
    if (!hasFirebaseConfig || !auth) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Log the login activity
        await logActivity({
            entity: 'auth',
            entityId: userCredential.user.uid,
            action: 'login',
            payload: { email: userCredential.user.email }
        });

        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
    if (!hasFirebaseConfig || !auth) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const user = auth.currentUser;
        const uid = user ? user.uid : 'unknown';
        const email = user ? user.email : 'unknown';

        await firebaseSignOut(auth);

        // Log the logout activity
        await logActivity({
            entity: 'auth',
            entityId: uid,
            action: 'logout',
            payload: { email }
        });
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

/**
 * Get the currently signed-in user
 * @returns {Object|null} Current user or null if not signed in
 */
export const getCurrentUser = () => {
    if (!hasFirebaseConfig || !auth) {
        return null;
    }
    return auth.currentUser;
};

/**
 * Listen for authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
    if (!hasFirebaseConfig || !auth) {
        callback(null);
        return () => { };
    }

    return firebaseOnAuthStateChanged(auth, callback);
};
