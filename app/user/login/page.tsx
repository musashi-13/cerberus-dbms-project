'use client'
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import ky from "ky";

export default function Login() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        try{
            const response = await ky.post('/api/auth/login-user', {
                json: { email, password },
            }).json<{token: string}>();
            const token = response.token;
            secureLocalStorage.setItem('token', token);
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}