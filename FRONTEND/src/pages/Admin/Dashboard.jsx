import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import ActivityItem from '../../components/admin/ActivityItem';

const AdminDashboard = () => {
    console.log('AdminDashboard rendering with components');
    
    // Mock statistics data
    const statistics = [
        { 
            title: 'Total Users',
            value: '15',
            color: 'blue',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        { 
            title: 'Total Income',
            value: '$4,500',
            color: 'green',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            title: 'Total Expenses',
            value: '$2,800',
            color: 'red',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
            )
        },
        { 
            title: 'Net Balance',
            value: '$1,700',
            color: 'purple',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    // Mock activity data
    const recentActivities = [
        { id: 1, name: 'John Doe', action: 'registered an account', time: 'Today, 10:30 AM', type: 'register' },
        { id: 2, name: 'Jane Smith', action: 'added income: $250.00', time: 'Yesterday, 4:15 PM', type: 'income' },
        { id: 3, name: 'Robert Johnson', action: 'added expense: $75.50', time: 'Yesterday, 2:30 PM', type: 'expense' },
        { id: 4, name: 'Sarah Williams', action: 'updated their profile information', time: '2 days ago', type: 'update' }
    ];

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Overview of the system performance and activities</p>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statistics.map((stat, index) => (
                    <StatCard 
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
                    <Link to="/admin/transactions" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            name={activity.name}
                            action={activity.action}
                            time={activity.time}
                            type={activity.type}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;