// src/firebase/testLog.js
import { createTeacher, deleteTeacher } from './teacherService';

async function run() {
    try {
        const dummy = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '1234567890',
            subject: 'Math',
            department: 'Science',
        };
        const created = await createTeacher(dummy);
        console.log('Created teacher id:', created.id);
        // Immediately delete to keep DB clean
        await deleteTeacher(created.id);
        console.log('Deleted teacher id:', created.id);
    } catch (e) {
        console.error('Error during testLog:', e);
    }
}

run();
