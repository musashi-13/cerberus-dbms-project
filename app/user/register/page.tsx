'use client'
import React from 'react';
import secureLocalStorage from 'react-secure-storage';
export default function Page(){

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value
        const response = await fetch('/api/auth/register-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name, phone }),
        });

        const data = await response.json();
        secureLocalStorage.setItem('token', data.token);
        console.log(data);
    }

    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input name='name' placeholder="Full Name"/>
                <input name='phone' type="number" placeholder='Phone Number'/>
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}