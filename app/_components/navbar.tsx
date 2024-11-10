'use client'
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { useState, useEffect } from "react";
import ky from "ky";
import Icon from "./icon-wrapper";
import { useAuth } from "../AuthContext";

interface AuthResponse {
    authenticated: boolean;
    userId: string;
    name: string;
}

export default function Navbar() {
    const { isLoggedIn, user, Logout, checkLoginStatus } = useAuth();
    const [token, setToken] = useState<string | null>(secureLocalStorage.getItem('token') as string | null);
    useEffect(() => {
        checkLoginStatus(); // Check login status whenever Navbar is loaded
    }, [token]);

    return (
        <nav className="flex items-center bg-zinc-900/60 backdrop-blur-lg justify-between px-5 py-2 w-screen">
            <div className="flex gap-1 items-baseline">
                <h1 className="text-xl font-bold text-amber-500">CERBERUS</h1>
                <p className="text-xs text-neutral-400">Your Service Partner</p>
            </div>
            {isLoggedIn && user ? (
            <div className="flex gap-2 items-center">
                <details className="list-none">
                    <summary className="list-none cursor-pointer text-amber-500 rounded-full border border-neutral-400 px-0.5 outline-none"><p className="translate-y-0.5"><Icon icon="person"/></p></summary>
                    <div className="flex flex-col gap-1 absolute w-24 bg-neutral-600 p-2 rounded-md -translate-x-16 translate-y-1">
                        <div className="w-full flex justify-between items-center">
                            <Link href={`/user/myprofile`}>Profile</Link>
                            <Icon icon="chevron_right"/>
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <Link href={`/user/add`}>Add Vehicle</Link>
                            <Icon icon="chevron_right"/>
                        </div>
                        <div className="w-full flex gap-1 justify-between items-center">
                            <button onClick={Logout} className="text-red-500">Logout</button>
                            <Icon icon="chevron_right"/>
                        </div>
                    </div>
                </details>
            </div>
            ) : (
            <div className="flex gap-2">
                <Link href="/employee/login" className="underline px-2 py-1">Staff</Link>
                <Link href="/user/login" className="bg-gradient-to-r from-amber-600 to-orange-600 px-2 py-1 rounded-md">Login</Link>
                <Link href="/user/register" className="border border-neutral-400 px-2 py-1 rounded-md">Register</Link>
            </div>
            )}
        </nav>
    )
}