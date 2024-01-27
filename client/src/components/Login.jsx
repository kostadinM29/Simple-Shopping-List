import React, { useState } from 'react';
import axios from 'axios';

import { useAuth } from '../hooks/useAuth';

const Login = () =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) =>
    {
        e.preventDefault();

        try
        {
            const response = await axios.post('https://localhost:7146/api/login', { email, password });

            if (response.data.success)
            {
                login(response.data.token);

                console.log(response.data.message);
            } else
            {
                console.error('Login failed:', response.data.message);
            }
        } catch (error)
        {
            console.error('Login failed:', error.response.data.message);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="max-w-md">
                <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
