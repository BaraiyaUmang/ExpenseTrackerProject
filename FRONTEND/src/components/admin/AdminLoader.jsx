import React from 'react';

const AdminLoader = ({ size = 'medium', text = 'Loading...' }) => {
    // Size classes for the spinner
    const sizeClasses = {
        small: 'h-5 w-5 border-2',
        medium: 'h-8 w-8 border-3',
        large: 'h-12 w-12 border-4'
    };

    // Get the appropriate size class or default to medium
    const spinnerSize = sizeClasses[size] || sizeClasses.medium;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className={`${spinnerSize} animate-spin rounded-full border-b-transparent border-blue-500`} />
            {text && <p className="mt-3 text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
    );
};

export default AdminLoader;
