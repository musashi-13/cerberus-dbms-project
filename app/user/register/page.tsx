'use client'
import React from 'react';

export default function Page(){

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        const response = await fetch('/api/auth/register-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        console.log(data);
    }

    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}