// models/Budget.js
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Make sure 'User' matches your User model name
        required: true,
        index: true, // Index for faster lookups by user
    },
    category: {
        type: String,
        required: [true, 'Budget category is required'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        min: [0.01, 'Budget amount must be a positive number'],
    },
    // Optional: Add a period if budgets are recurring (e.g., 'monthly', 'yearly')
    // period: {
    //   type: String,
    //   enum: ['monthly', 'yearly', 'one-time'],
    //   default: 'monthly'
    // },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Optional: Ensure a user cannot have two budgets for the same category (if needed)
// BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);