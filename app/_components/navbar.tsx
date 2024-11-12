'use client'
import secureLocalStorage from "react-secure-storage";
import { useState, useEffect } from "react";
import Icon from "./icon-wrapper";
import { useAuth } from "../AuthContext";
import Link from "next/link";
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
                <Link href={'/'} className="text-xl font-bold text-amber-500">CERBERUS</Link>
                <p className="text-xs text-neutral-400">Your Service Partner</p>
            </div>
            {isLoggedIn && user ? (
            <div className="flex gap-2 items-center">
                <details className="list-none">
                    <summary className="list-none cursor-pointer text-amber-500 rounded-full border border-zinc-600 px-0.5 outline-none"><p className="translate-y-0.5"><Icon icon="person"/></p></summary>
                    <div className="flex flex-col gap-2 absolute w-36 bg-zinc-900/60 backdrop-blur-lg border border-zinc-600 px-3 py-2 rounded-md -translate-x-24 translate-y-3">
                        <Link href={`/user/myprofile`} className="w-full flex justify-between items-center">Profile <Icon icon="chevron_right"/></Link>
                        <Link href={`/user/add`} className="w-full flex justify-between items-center">Add Vehicle<Icon icon="chevron_right"/></Link>
                        <button onClick={Logout} className="w-full border-t pt-1 border-zinc-600 flex justify-between items-center text-red-500">Logout<Icon icon="logout"/></button>
                    </div>
                </details>
            </div>
            ) : (
            <div className="flex gap-2">
                <Link href="/employee/login" className="underline px-2 py-1">Staff</Link>
                <Link href="/user/login" className="bg-gradient-to-r from-amber-600 to-orange-600 px-2 py-1 rounded-md">Login</Link>
                <Link href="/user/register" className="border border-zinc-600 px-2 py-1 rounded-md">Register</Link>
            </div>
            )}
        </nav>
    )
}