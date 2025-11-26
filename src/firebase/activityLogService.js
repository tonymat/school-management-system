import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, hasFirebaseConfig, auth } from './config';

/**
 * Write an activity log entry to Firestore.
 *
 * @param {Object} params
 * @param {'teacher'|'student'} params.entity          // which collection
 * @param {string} params.entityId                     // document ID that changed
 * @param {'create'|'update'|'delete'} params.action // CRUD action
 * @param {Object} [params.payload]                   // optional snapshot of the data after change
 */
export const logActivity = async ({ entity, entityId, action, payload }) => {
    if (!hasFirebaseConfig) {
        console.warn('⚠️ Firebase not configured – activity log skipped');
        return;
    }

    try {
        const user = auth?.currentUser;

        await addDoc(collection(db, 'activityLogs'), {
            entity,
            entityId,
            action,
            payload: payload || null,
            timestamp: serverTimestamp(),
            userId: user ? user.uid : 'anonymous',
            userEmail: user ? user.email : 'anonymous'
        });
    } catch (err) {
        console.error('❌ Failed to write activity log:', err);
    }
};
