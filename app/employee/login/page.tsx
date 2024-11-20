'use client'
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import ky from "ky";
import { useState } from "react";
import Icon from "@/app/_components/icon-wrapper";
import Link from "next/link";

export default function EmployeeLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const employeeId = (form.elements.namedItem('employeeId') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        
        try {
            const response = await ky.post('/api/auth/login-employee', {
                json: { employee_id: employeeId, password },
            }).json<{ token: string }>();
            const token = response.token;
            secureLocalStorage.setItem('token', token);
            router.push('/employee-dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-garage-3 h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96 -translate-y-16 items-center rounded-md flex flex-col gap-2 p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-600">
                <h1 className="text-lg">Employee Login to <span className="text-xl text-amber-500 font-bold">CERBERUS</span></h1>
                <input 
                    className="w-64 border-b-2 border-zinc-600/60 p-1 bg-transparent outline-none" 
                    type="text" 
                    name="employeeId" 
                    placeholder="Employee ID" 
                />
                <input 
                    className="w-64 border-b-2 border-zinc-600/60 p-1 bg-transparent outline-none" 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                />
                <Link href={'/employee/register'} className="text-xs text-zinc-400 w-64 text-right">New Employee? <u>Register</u></Link>
                
                <button 
                    disabled={isLoading} 
                    type="submit" 
                    className="mt-2 w-36 px-2 py-1 flex items-center justify-center rounded-md bg-gradient-to-r from-amber-600 to-orange-600">
                    {!isLoading ? 'Login' : 
                    <span className="animate-spin flex items-center justify-center"><Icon icon="progress_activity" /></span>}
                </button>
            </form>
        </div>
    )
}
