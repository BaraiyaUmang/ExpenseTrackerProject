import React from 'react';

const AdminEmptyState = ({ 
    icon, 
    title = 'No data available', 
    message = 'There is no data to display at this time.',
    actionText,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            {icon && (
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                {message}
            </p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default AdminEmptyState; 