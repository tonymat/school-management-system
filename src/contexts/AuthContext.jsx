import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signIn, signUp, signOut } from '../firebase/authService';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        return await signIn(email, password);
    };

    const signup = async (email, password) => {
        return await signUp(email, password);
    };

    const logout = async () => {
        return await signOut();
    };

    const value = {
        currentUser,
        loading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
