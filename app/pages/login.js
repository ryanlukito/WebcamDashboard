// pages/login.js
import { useState } from 'react';
import login from '../api/auth'; // Import fungsi login dari auth.js
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter(); // Menggunakan router untuk redirect

    const handleLogin = async () => {
        const response = await login(email, password); // Memanggil fungsi login
        
        if (response.success) {
            setMessage(`Welcome, ${response.userName}!`);
            router.push('/'); // Redirect ke halaman utama setelah login
        } else {
            setMessage(response.message); // Menampilkan pesan error jika login gagal
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '5px', padding: '8px' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '5px', padding: '8px' }}
            />
            <button onClick={handleLogin} style={{ margin: '5px', padding: '8px' }}>Login</button>
            {message && <p>{message}</p>} {/* Menampilkan pesan login */}
        </div>
    );
}
