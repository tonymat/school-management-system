import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../firebase/config';
import './LogsPage.css';

function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hasFirebaseConfig) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'activityLogs'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLogs(data);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching logs:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    const getActionBadgeClass = (action) => {
        switch (action) {
            case 'create':
                return 'badge-create';
            case 'update':
                return 'badge-update';
            case 'delete':
                return 'badge-delete';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="logs-page">
                <div className="loading">Loading activity logs...</div>
            </div>
        );
    }

    if (!hasFirebaseConfig) {
        return (
            <div className="logs-page">
                <div className="empty-state">
                    <p>Firebase not configured. Please set up .env.local file.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="logs-page">
            <div className="page-header">
                <h1>Activity Log</h1>
                <p className="subtitle">Track all create, update, and delete operations</p>
            </div>

            {logs.length === 0 ? (
                <div className="empty-state">
                    <p>No activity logs yet. Start by adding teachers or students!</p>
                </div>
            ) : (
                <div className="logs-table-container">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Entity</th>
                                <th>Action</th>
                                <th>Entity ID</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="timestamp">{formatTimestamp(log.timestamp)}</td>
                                    <td>
                                        <span className="entity-badge">{log.entity}</span>
                                    </td>
                                    <td>
                                        <span className={`action-badge ${getActionBadgeClass(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="entity-id">{log.entityId}</td>
                                    <td className="payload">
                                        {log.payload ? (
                                            <details>
                                                <summary>View data</summary>
                                                <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                                            </details>
                                        ) : (
                                            <span className="no-data">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LogsPage;
