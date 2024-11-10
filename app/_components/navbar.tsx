'use client'
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { useState, useEffect } from "react";
import ky from "ky";

interface AuthResponse {
    authenticated: boolean;
    userId: string;
    name: string;
}

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<{ userId: string; name: string } | null>(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = secureLocalStorage.getItem('token')
                if (!token) return;
                const response = await ky.get('/api/logged-in', {
                    headers: { Authorization: `Bearer ${token}` },
                }).json<AuthResponse>();

                setIsLoggedIn(true);
                setUser({
                    userId: response.userId,
                    name: response.name,
                });
            } catch (error) {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);


    return (
        <nav className="flex items-center bg-neutral-800 justify-between px-4 py-2 w-screen">
            <div className="flex gap-2 items-baseline">
                <h1 className="text-xl font-bold text-amber-500">CERBERUS</h1>
                <p className="text-sm text-neutral-400">Your Service Partner</p>
            </div>
            {isLoggedIn && user ? (
            <div className="flex gap-2">
                <Link href="/employee/login" className="underline px-2 py-1">Staff</Link>
                <Link href="/user/login" className="bg-amber-500 px-2 py-1 rounded-md">Login</Link>
                <Link href="/user/register" className="border border-neutral-400 px-2 py-1 rounded-md">Register</Link>
            </div>
            ) : (
                <div>
                    Logout
                </div>
            )}
        </nav>
    )
}