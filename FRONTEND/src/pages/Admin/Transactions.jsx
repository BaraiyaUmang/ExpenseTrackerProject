import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SearchInput from '../../components/admin/SearchInput';
import TransactionRow from '../../components/admin/TransactionRow';
import { useAdmin } from '../../context/AdminContext';

const TransactionsPage = () => {
    console.log('TransactionsPage rendering with components');
    
    const { users: contextUsers = [] } = useAdmin();
    
    // Static data for immediate display
    const staticUsers = [
        {
            _id: 'user1',
            fullName: 'John Doe',
            email: 'john@example.com',
            profileImageUrl: null
        },
        {
            _id: 'user2',
            fullName: 'Jane Smith',
            email: 'jane@example.com',
            profileImageUrl: null
        },
        {
            _id: 'admin1',
            fullName: 'Admin User',
            email: 'admin@example.com',
            profileImageUrl: null
        }
    ];

    const staticTransactions = {
        incomes: [
            {
                _id: 'inc1',
                title: 'Salary',
                amount: 3500,
                date: '2023-04-01T10:00:00Z',
                category: 'Work',
                description: 'Monthly salary',
                type: 'income'
            },
            {
                _id: 'inc2',
                title: 'Freelance',
                amount: 800,
                date: '2023-03-25T15:30:00Z',
                category: 'Work',
                description: 'Website development project',
                type: 'income'
            }
        ],
        expenses: [
            {
                _id: 'exp1',
                title: 'Groceries',
                amount: 150,
                date: '2023-04-02T09:15:00Z',
                category: 'Food',
                description: 'Weekly grocery shopping',
                type: 'expense'
            },
            {
                _id: 'exp2',
                title: 'Electric Bill',
                amount: 85,
                date: '2023-03-30T14:45:00Z',
                category: 'Utilities',
                description: 'Monthly electricity bill',
                type: 'expense'
            },
            {
                _id: 'exp3',
                title: 'Dinner',
                amount: 65,
                date: '2023-03-28T20:00:00Z',
                category: 'Food',
                description: 'Restaurant with friends',
                type: 'expense'
            }
        ]
    };

    const [selectedUser, setSelectedUser] = useState(null);
    const [transactions] = useState(staticTransactions);
    const [transactionType, setTransactionType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    // Get filtered transactions based on type and search
    const getFilteredTransactions = () => {
        let result = [];
        
        if (transactionType === 'income' || transactionType === 'all') {
            result = [...result, ...transactions.incomes];
        }
        
        if (transactionType === 'expense' || transactionType === 'all') {
            result = [...result, ...transactions.expenses];
        }
        
        // Filter by search term if provided
        if (searchTerm) {
            result = result.filter(transaction => 
                transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Sort by date (newest first)
        return result.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Filter users based on search term
    const filteredUsers = staticUsers.filter(user => 
        user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    const filteredTransactions = selectedUser ? getFilteredTransactions() : [];

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions Management</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">View and manage user transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* User List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Select User</h2>
                    </div>
                    <div className="p-4">
                        <SearchInput 
                            placeholder="Search users..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <li 
                                    key={user._id} 
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                        selectedUser && selectedUser._id === user._id 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                                            : ''
                                    }`}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.profileImageUrl ? (
                                                <img className="h-10 w-10 rounded-full" src={user.profileImageUrl} alt={user.fullName} />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <span className="text-gray-500 dark:text-gray-300 text-lg font-medium">{user.fullName.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Transactions */}
                <div className="lg:col-span-3">
                    {selectedUser ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Transactions for {selectedUser.fullName}
                                </h2>
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                        <option value="all">All Transactions</option>
                                        <option value="income">Income Only</option>
                                        <option value="expense">Expenses Only</option>
                                    </select>
                                    <div className="w-full md:w-auto">
                                        <SearchInput
                                            placeholder="Search transactions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {filteredTransactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredTransactions.map((transaction) => (
                                                <TransactionRow key={transaction._id} transaction={transaction} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    {searchTerm 
                                        ? 'No transactions found matching the search criteria.' 
                                        : 'No transactions found for this user.'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <p className="text-gray-500 dark:text-gray-400 text-center">
                                Select a user to view their transactions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default TransactionsPage; 