import React from 'react';

const UserRow = ({ user, onToggleAdmin, onDelete }) => {
    const { _id, fullName, email, isAdmin, createdAt, profileImageUrl } = user;

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        {profileImageUrl ? (
                            <img className="h-10 w-10 rounded-full" src={profileImageUrl} alt={fullName} />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-300 text-lg font-medium">
                                    {fullName.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">{email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    isAdmin 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                    {isAdmin ? 'Admin' : 'User'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onToggleAdmin(_id, !isAdmin)}
                    className={`px-3 py-1 rounded-md mr-2 ${
                        isAdmin
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                    }`}
                >
                    {isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                    onClick={() => onDelete(_id)}
                    className="px-3 py-1 rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default UserRow; 