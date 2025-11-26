import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { auth, hasFirebaseConfig } from './config';
import { logActivity } from './activityLogService';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User credential
 */
export const signUp = async (email, password) => {
    if (!hasFirebaseConfig || !auth) {
        throw new Error('Firebase not configured. Please set up .env.local file.');
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Log the signup activity
        await logActivity({
            entity: 'auth',
            entityId: userCredential.user.uid,
            action: 'signup',
            payload: { email: userCredential.user.email }
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
