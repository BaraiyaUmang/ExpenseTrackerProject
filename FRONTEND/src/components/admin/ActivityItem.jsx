import React from 'react';

const ActivityItem = ({ avatar, name, action, time, type }) => {
    // Define the background color based on activity type
    const getBgColor = () => {
        switch (type) {
            case 'register':
                return 'bg-blue-100 dark:bg-blue-900/30';
            case 'income':
                return 'bg-green-100 dark:bg-green-900/30';
            case 'expense':
                return 'bg-red-100 dark:bg-red-900/30';
            default:
                return 'bg-gray-100 dark:bg-gray-800/50';
        }
    };

    // Define the avatar background color based on activity type
    const getAvatarBgColor = () => {
        switch (type) {
            case 'register':
                return 'bg-blue-200 dark:bg-blue-800 text-blue-600 dark:text-blue-300';
            case 'income':
                return 'bg-green-200 dark:bg-green-800 text-green-600 dark:text-green-300';
            case 'expense':
                return 'bg-red-200 dark:bg-red-800 text-red-600 dark:text-red-300';
            default:
                return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
        }
    };

    return (
        <div className={`p-4 rounded-lg ${getBgColor()}`}>
            <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAvatarBgColor()}`}>
                    {avatar || name.charAt(0)}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        <span className="font-semibold">{name}</span> {action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityItem; 