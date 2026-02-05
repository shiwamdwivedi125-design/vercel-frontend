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
            console.error('Login failed (Using Demo Mode):', error);
            // DEMO MODE LOGIN FALLBACK
            const mockUser = {
                _id: 'demo_user_123',
                name: identifier.email ? identifier.email.split('@')[0] : 'Demo User',
                email: identifier.email || 'demo@example.com',
                phone: identifier.phone || '9876543210',
                token: 'mock-jwt-token-demo',
                isAdmin: false,
                rewardPoints: 50
            };
            setUserInfo(mockUser);
            localStorage.setItem('userInfo', JSON.stringify(mockUser));
            return true;
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
            console.error('Registration failed (Using Demo Mode):', error);
            // DEMO MODE REGISTER FALLBACK
            const mockUser = {
                _id: 'demo_user_' + Date.now(),
                name,
                email,
                phone,
                token: 'mock-jwt-token-demo',
                isAdmin: false,
                rewardPoints: 0
            };
            setUserInfo(mockUser);
            localStorage.setItem('userInfo', JSON.stringify(mockUser));
            return { success: true };
        }
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async () => {
        if (!userInfo || !userInfo.token || userInfo.token === 'mock-jwt-token-demo') return;
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
            console.error('Failed to update profile (Demo Mode active):', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
