import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_PATHS, BASE_URL } from '../utils/apiPaths';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user details if token exists
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) return;
            
            setLoading(true);
            try {
                // For debugging purposes, create a mock admin user
                // Remove this in production and uncomment the API call
                console.log('Creating mock admin user for testing');
                setUser({
                    _id: 'admin123',
                    fullName: 'Admin User',
                    email: 'admin@example.com',
                    isAdmin: true
                });
                
                // In a real app, you would fetch the user from the API
                // const response = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });
                // setUser(response.data);
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError(err.response?.data?.message || 'Failed to fetch user info');
                // Clear token if it's invalid
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BASE_URL}${API_PATHS.AUTH.LOGIN}`, {
                email,
                password,
            });
            
            const { token: newToken, user: userData } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout,
    };

    console.log('UserContext rendering with user:', user?.fullName, 'isAdmin:', user?.isAdmin);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;