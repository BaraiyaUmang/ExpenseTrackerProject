import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    console.log('AdminProvider rendering with children:', !!children);
    
    // Very basic state
    const [adminStats] = useState({
        totalUsers: 15,
        adminUsers: 2,
        regularUsers: 13,
        totalIncome: 4500,
        totalExpense: 2800,
        netBalance: 1700
    });
    
    const [users] = useState([
        {
            _id: 'user1',
            fullName: 'John Doe',
            email: 'john@example.com',
            isAdmin: false,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'user2',
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            isAdmin: false,
            createdAt: new Date().toISOString()
        },
        {
            _id: 'admin1',
            fullName: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
            createdAt: new Date().toISOString()
        }
    ]);
    
    // Simple stub functions
    const fetchAdminStats = () => console.log('fetchAdminStats called');
    const fetchAllUsers = () => console.log('fetchAllUsers called');
    const fetchUserDetails = () => console.log('fetchUserDetails called');
    const updateUserAdmin = () => console.log('updateUserAdmin called');
    const deleteUser = () => console.log('deleteUser called');
    const fetchUserTransactions = () => console.log('fetchUserTransactions called');

    const value = {
        adminStats,
        users,
        loading: false,
        error: null,
        fetchAdminStats,
        fetchAllUsers,
        fetchUserDetails,
        updateUserAdmin,
        deleteUser,
        fetchUserTransactions,
    };

    console.log('AdminContext providing value');

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContext; 