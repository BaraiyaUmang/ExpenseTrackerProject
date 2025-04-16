import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchInput from '../../components/admin/SearchInput';
import UserRow from '../../components/admin/UserRow';
import { useAdmin } from '../../context/AdminContext';

const UsersPage = () => {
    console.log('UsersPage rendering with components');
    
    const { users: contextUsers } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Use context users or static users if context not available
    const users = contextUsers || [
        {
            _id: 'user1',
            fullName: 'John Doe',
            email: 'john@example.com',
            isAdmin: false,
            createdAt: '2023-04-01T10:30:00Z',
            profileImageUrl: null
        },
        {
            _id: 'user2',
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            isAdmin: false,
            createdAt: '2023-03-15T08:45:00Z',
            profileImageUrl: null
        },
        {
            _id: 'admin1',
            fullName: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
            createdAt: '2023-01-10T14:20:00Z',
            profileImageUrl: null
        }
    ];
    
    // Filter users based on search term
    const filteredUsers = users.filter(
        user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle making or removing admin status
    const handleToggleAdmin = (userId, isAdmin) => {
        console.log(`Toggle admin status for user ${userId} to ${isAdmin ? 'admin' : 'user'}`);
        // In a real app, this would call updateUserAdmin from the context
    };

    // Handle user deletion
    const handleDeleteUser = (userId) => {
        console.log(`Delete user with ID: ${userId}`);
        // In a real app, this would call deleteUser from the context
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Users Management</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your system users</p>
            </div>
            
            <div className="mb-6">
                <SearchInput 
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <UserRow 
                                        key={user._id}
                                        user={user}
                                        onToggleAdmin={handleToggleAdmin}
                                        onDelete={handleDeleteUser}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'No users found matching the search criteria.' : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;