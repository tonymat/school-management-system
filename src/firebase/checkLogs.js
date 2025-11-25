// src/firebase/checkLogs.js
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './config';

async function main() {
    if (!hasFirebaseConfig) {
        console.error('Firebase not configured');
        return;
    }
    try {
        const q = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        console.log('--- Recent Activity Logs ---');
        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`${doc.id}: ${data.entity} ${data.entityId} ${data.action}`, data.payload || '');
        });
    } catch (e) {
        console.error('Error fetching logs:', e);
    }
}

main();
