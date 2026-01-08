import { createContext, useState, useEffect } from 'react';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    );

    const login = async (identifier, password) => {
        try {
            const response = await fetch(`${config.API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...identifier, password })
            });

            const data = await response.json();

            if (response.ok) {
                setUserInfo(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, phone, password) => {
        try {
            const response = await fetch(`${config.API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async () => {
        if (!userInfo || !userInfo.token) return;
        try {
            const response = await fetch(`${config.API_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                const newUserInfo = { ...data, token: userInfo.token };
                setUserInfo(newUserInfo);
                localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
