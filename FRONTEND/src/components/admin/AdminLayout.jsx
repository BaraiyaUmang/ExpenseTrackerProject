import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import AdminIcon from './AdminIcon';

const AdminLayout = ({ children }) => {
    const { user } = useUser();
    const location = useLocation();
    
    console.log('AdminLayout rendering, path:', location.pathname);
    
    // Check if the current path matches a nav item path
    const isActivePath = (path) => {
        if (path === '/admin' && location.pathname === '/admin') {
            return true;
        }
        if (path !== '/admin' && location.pathname.startsWith(path)) {
            return true;
        }
        return false;
    };
    
    const navItems = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: <AdminIcon type="dashboard" className="h-5 w-5" />,
        },
        {
            path: '/admin/users',
            label: 'Users',
            icon: <AdminIcon type="users" className="h-5 w-5" />,
        },
        {
            path: '/admin/transactions',
            label: 'Transactions',
            icon: <AdminIcon type="transactions" className="h-5 w-5" />,
        },
        {
            path: '/dashboard',
            label: 'Back to App',
            icon: <AdminIcon type="back" className="h-5 w-5" />,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
                    {user ? (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Logged in as: {user.fullName}
                            <br />
                            <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                user.isAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-red-600">Not logged in</p>
                    )}
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                isActivePath(item.path)
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400'
                                    : ''
                            }`}
                        >
                            {item.icon}
                            <span className="mx-3">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="container px-6 py-8 mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout; 