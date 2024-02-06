'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>(''); // Add password state
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        const storedUsers = Cookies.get('users');
        const storedSelectedUser = Cookies.get('selectedUser');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
        if (storedSelectedUser) {
            setSelectedUser(storedSelectedUser);
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const newUser = await response.json();
            console.log(newUser);

            const updatedUsers = [...users, newUser.username];
            setUsers(updatedUsers);
            Cookies.set('users', JSON.stringify(updatedUsers), { expires: 7 });
        } else {
            const error = await response.json();
            console.error(error);
        }
    };

    const handleSelectUser = (username: string) => {
        setSelectedUser(username);
        Cookies.set('selectedUser', username, { expires: 7 });
    };

    return (
        <div>
            {users.length > 0 && (
                <div>
                    <h3>Previous Users</h3>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index} onClick={() => handleSelectUser(user)} style={{cursor: 'pointer'}}>
                                {user}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedUser && <p>Selected User: {selectedUser}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label> {/* Add password field */}
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full">
                    Login or Create User
                </button>
            </form>
        </div>
    );
};

export default LoginForm;