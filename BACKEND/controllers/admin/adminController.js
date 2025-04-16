const User = require('../../models/User');
const Income = require('../../models/Income');
const Expense = require('../../models/Expense');
const Category = require('../../models/Category');
const Settings = require('../../models/Settings');
const mongoose = require('mongoose');

// ADMIN DASHBOARD STATISTICS
exports.getAdminStats = async (req, res) => {
    try {
        // Get total users
        const totalUsers = await User.countDocuments();
        
        // Get total transactions
        const totalIncomes = await Income.countDocuments();
        const totalExpenses = await Expense.countDocuments();
        const totalTransactions = totalIncomes + totalExpenses;
        
        // Get total amount
        const incomeTotal = await Income.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const expenseTotal = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const totalAmount = (incomeTotal[0]?.total || 0) - (expenseTotal[0]?.total || 0);
        const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
        
        // Get recent users
        const recentUsers = await User.find()
            .select('_id fullName email createdAt')
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get recent transactions
        const recentIncomes = await Income.find()
            .select('_id userId source amount date')
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'fullName');
        
        const recentExpenses = await Expense.find()
            .select('_id userId category amount date')
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'fullName');
        
        // Combine and sort recent transactions
        const recentTransactions = [...recentIncomes, ...recentExpenses]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)
            .map(transaction => {
                return {
                    id: transaction._id,
                    description: transaction.source || transaction.category,
                    amount: transaction.amount,
                    date: transaction.date,
                    category: transaction.source ? 'Income' : transaction.category,
                    userName: transaction.userId.fullName
                };
            });
        
        res.status(200).json({
            totalUsers,
            totalTransactions,
            totalAmount,
            averageAmount,
            recentUsers: recentUsers.map(user => ({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt
            })),
            recentTransactions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
    }
};

// USER MANAGEMENT
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .select('_id fullName email status role createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            users: users.map(user => ({
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                status: user.status,
                role: user.role,
                createdAt: user.createdAt
            })),
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, role, status } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        const user = new User({
            fullName,
            email,
            password,
            role: role || 'user',
            status: status || 'active'
        });
        
        await user.save();
        
        res.status(201).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { fullName, email, role, status } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, email, role, status },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Also delete all user's income and expense records
        await Income.deleteMany({ userId: req.params.id });
        await Expense.deleteMany({ userId: req.params.id });
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// TRANSACTION ANALYTICS
exports.getTransactionAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy } = req.query;
        
        const match = {};
        if (startDate && endDate) {
            match.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Group by time period
        let groupByTimeFormat;
        if (groupBy === 'day') {
            groupByTimeFormat = { 
                $dateToString: { format: "%Y-%m-%d", date: "$date" } 
            };
        } else if (groupBy === 'week') {
            groupByTimeFormat = { 
                $toString: { $week: "$date" }
            };
        } else { // default month
            groupByTimeFormat = { 
                $dateToString: { format: "%Y-%m", date: "$date" } 
            };
        }
        
        // Income analytics by period
        const incomeByPeriod = await Income.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupByTimeFormat,
                    count: { $sum: 1 },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Expense analytics by period
        const expenseByPeriod = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupByTimeFormat,
                    count: { $sum: 1 },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Income analytics by category
        const incomeByCategory = await Income.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$source",
                    count: { $sum: 1 },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { amount: -1 } }
        ]);
        
        // Expense analytics by category
        const expenseByCategory = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { amount: -1 } }
        ]);
        
        // Calculate total amounts
        const totalIncome = incomeByCategory.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenseByCategory.reduce((sum, item) => sum + item.amount, 0);
        
        // Create period-based data in correct format
        const transactionsByPeriod = [];
        
        // Combine income and expense data for each period
        const allPeriods = new Set([
            ...incomeByPeriod.map(item => item._id),
            ...expenseByPeriod.map(item => item._id)
        ]);
        
        allPeriods.forEach(period => {
            const incomeData = incomeByPeriod.find(item => item._id === period) || { count: 0, amount: 0 };
            const expenseData = expenseByPeriod.find(item => item._id === period) || { count: 0, amount: 0 };
            
            transactionsByPeriod.push({
                period,
                count: incomeData.count + expenseData.count,
                amount: incomeData.amount - expenseData.amount
            });
        });
        
        // Create category-based data in correct format
        const transactionsByCategory = [
            ...incomeByCategory.map(item => ({
                category: item._id,
                count: item.count,
                amount: item.amount,
                type: 'income'
            })),
            ...expenseByCategory.map(item => ({
                category: item._id,
                count: item.count,
                amount: item.amount,
                type: 'expense'
            }))
        ];
        
        res.status(200).json({
            transactionsByPeriod: transactionsByPeriod.sort((a, b) => a.period.localeCompare(b.period)),
            transactionsByCategory,
            totalAmount: totalIncome - totalExpense,
            totalCount: transactionsByCategory.reduce((sum, item) => sum + item.count, 0)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction analytics', error: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Get total transactions count
        const totalIncomes = await Income.countDocuments();
        const totalExpenses = await Expense.countDocuments();
        const totalTransactions = totalIncomes + totalExpenses;
        
        // Get incomes with user data
        const incomes = await Income.find()
            .select('_id userId source amount date createdAt')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'fullName');
        
        // Get expenses with user data
        const expenses = await Expense.find()
            .select('_id userId category amount date createdAt')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'fullName');
        
        // Combine and sort transactions
        const allTransactions = [...incomes, ...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
            .map(transaction => {
                return {
                    id: transaction._id,
                    userId: transaction.userId._id,
                    userName: transaction.userId.fullName,
                    description: transaction.source || transaction.category,
                    amount: transaction.amount,
                    category: transaction.source ? 'Income' : transaction.category,
                    date: transaction.date,
                    type: transaction.source ? 'income' : 'expense'
                };
            });
        
        res.status(200).json({
            transactions: allTransactions,
            totalTransactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

// ADMIN SETTINGS & CONFIGURATION
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne().populate('availableCategories');
        
        if (!settings) {
            // If no settings exist, create default settings
            const defaultSettings = new Settings({
                currencyFormat: 'INR',
                availableCategories: []
            });
            settings = await defaultSettings.save();
        }
        
        // Get all categories
        const categories = await Category.find().sort({ name: 1 });
        
        res.status(200).json({
            currencyFormat: settings.currencyFormat,
            availableCategories: categories.map(cat => cat.name)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { currencyFormat, availableCategories } = req.body;
        
        // Find existing settings
        let settings = await Settings.findOne();
        
        if (!settings) {
            // If no settings exist, create new settings
            settings = new Settings();
        }
        
        settings.currencyFormat = currencyFormat || settings.currencyFormat;
        
        // Handle categories if provided
        if (availableCategories && Array.isArray(availableCategories)) {
            // Process each category
            const categoryIds = [];
            
            for (const categoryName of availableCategories) {
                let category = await Category.findOne({ name: categoryName });
                
                if (!category) {
                    // Create new category if it doesn't exist
                    category = new Category({
                        name: categoryName,
                        icon: 'tag', // Default icon
                        type: 'expense' // Default type
                    });
                    await category.save();
                }
                
                categoryIds.push(category._id);
            }
            
            settings.availableCategories = categoryIds;
        }
        
        await settings.save();
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
}; 