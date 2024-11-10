'use client'
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import ky from 'ky';

interface AuthContextType {
    isLoggedIn: boolean;
    user: { userId: string; name: string } | null;
    setIsLoggedIn: (value: boolean) => void;
    setUser: (user: { userId: string; name: string } | null) => void;
    checkLoginStatus: () => Promise<void>;
    Logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<{ userId: string; name: string } | null>(null);

    const checkLoginStatus = async () => {
        try {
            const token = secureLocalStorage.getItem('token');
            if (!token) return;

            const response = await ky
                .get('/api/logged-in', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .json<{ authenticated: boolean; userId: string; name: string }>();

            if (response.authenticated) {
                setIsLoggedIn(true);
                setUser({
                    userId: response.userId,
                    name: response.name,
                });
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.log(error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const Logout = () => {
        secureLocalStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser, checkLoginStatus, Logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
