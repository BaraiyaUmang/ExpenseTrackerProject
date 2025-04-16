import React from 'react';

const TransactionRow = ({ transaction }) => {
    const { _id, title, amount, date, category, description, type } = transaction;

    return (
        <tr key={_id}>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    type === 'income' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                    {type === 'income' ? 'Income' : 'Expense'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    ${parseFloat(amount).toFixed(2)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {description || '-'}
            </td>
        </tr>
    );
};

export default TransactionRow; 