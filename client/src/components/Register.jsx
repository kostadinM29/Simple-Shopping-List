import React, { useState } from 'react';
import axios from 'axios';

const Register = () =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) =>
    {
        e.preventDefault();

        try
        {
            console.log({ email, password });
            const response = await axios.post('https://localhost:7146/api/register', { email, password });
            console.log(response.data);
        } catch (error)
        {
            console.error('Registration failed:', error.response.errors);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="max-w-md">
                <label className="block mb-2">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border mb-4"
                />

                <label className="block mb-2">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border mb-4"
                />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
