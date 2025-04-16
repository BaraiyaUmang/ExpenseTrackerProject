import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    // Define color classes based on the color prop
    const colorClasses = {
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-200 dark:bg-blue-800'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900',
            text: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-200 dark:bg-green-800'
        },
        red: {
            bg: 'bg-red-100 dark:bg-red-900',
            text: 'text-red-600 dark:text-red-400',
            iconBg: 'bg-red-200 dark:bg-red-800'
        },
        purple: {
            bg: 'bg-purple-100 dark:bg-purple-900',
            text: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-200 dark:bg-purple-800'
        }
    };

    const colorClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`${colorClass.bg} rounded-lg shadow-md p-6`}>
            <div className="flex items-center">
                {icon && (
                    <div className={`p-3 rounded-full ${colorClass.iconBg} ${colorClass.text} mr-4`}>
                        {icon}
                    </div>
                )}
                <div>
                    <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">{title}</h2>
                    <p className={`text-2xl font-bold ${colorClass.text}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard; 