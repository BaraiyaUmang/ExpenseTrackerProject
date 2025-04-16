require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Default income categories
const defaultIncomeCategories = [
    { name: 'Salary', icon: 'cash', type: 'income' },
    { name: 'Freelance', icon: 'briefcase', type: 'income' },
    { name: 'Investments', icon: 'trending-up', type: 'income' },
    { name: 'Gifts', icon: 'gift', type: 'income' },
    { name: 'Other Income', icon: 'plus-circle', type: 'income' }
];

// Default expense categories
const defaultExpenseCategories = [
    { name: 'Food', icon: 'restaurant', type: 'expense' },
    { name: 'Housing', icon: 'home', type: 'expense' },
    { name: 'Transportation', icon: 'car', type: 'expense' },
    { name: 'Entertainment', icon: 'film', type: 'expense' },
    { name: 'Shopping', icon: 'shopping-bag', type: 'expense' },
    { name: 'Utilities', icon: 'zap', type: 'expense' },
    { name: 'Healthcare', icon: 'activity', type: 'expense' },
    { name: 'Education', icon: 'book', type: 'expense' },
    { name: 'Travel', icon: 'map', type: 'expense' },
    { name: 'Other Expense', icon: 'more-horizontal', type: 'expense' }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
        
        // Delete existing categories
        await Category.deleteMany({});
        console.log('Deleted existing categories');
        
        // Insert default categories
        await Category.insertMany([...defaultIncomeCategories, ...defaultExpenseCategories]);
        console.log('Added default categories');
        
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB disconnected...');
        
        console.log('Categories initialization complete!');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

connectDB(); 