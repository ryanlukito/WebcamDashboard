// app/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import login  from "../app/api/auth/auth";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        // Implementasi logika login
        const response = await login(email, password);
        if (response.success) {
            setMessage(`Welcome, ${response.userName}!`);
            router.push('/dashboard'); // Redirect ke halaman utama setelah login
        } else {
            setMessage(response.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Peeplytics AI</h1>
                <input
                    type="text"
                    placeholder="User Name"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="relative mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {/* <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">👁</span>  */}
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full py-2 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                    Log In
                </button>
                {message && <p className="mt-4 text-center text-red-500 text-sm">{message}</p>}
            </div>
        </div>
    );
}