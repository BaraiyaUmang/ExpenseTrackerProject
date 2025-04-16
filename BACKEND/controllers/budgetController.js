// controllers/budgetController.js
const Budget = require('../models/Budget');
const asyncHandler = require('../middleware/asyncHandler'); // Assuming you have this for error handling
const ErrorResponse = require('../utils/errorResponse'); // Assuming you have a custom error handler

// @desc    Get all budgets for logged-in user
// @route   GET /api/v1/budgets  (Assuming this will be the final path)
// @access  Private
exports.getBudgets = asyncHandler(async (req, res, next) => {
    // req.user should be populated by your authMiddleware
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets); // Send the array directly
});

// @desc    Create a new budget
// @route   POST /api/v1/budgets
// @access  Private
exports.createBudget = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse('Not authorized', 401));
    }

    const { category, amount } = req.body;

    if (!category || !amount) {
         return next(new ErrorResponse('Please provide category and amount', 400));
    }

    // Check if budget for this category already exists for the user (optional)
    // const existingBudget = await Budget.findOne({ user: req.user.id, category });
    // if (existingBudget) {
    //      return next(new ErrorResponse(`Budget already exists for category '${category}'`, 400));
    // }

    const budget = await Budget.create({
        user: req.user.id,
        category,
        amount
    });

    res.status(201).json(budget);
});

// @desc    Update a specific budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
exports.updateBudget = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse('Not authorized', 401));
    }

    const { category, amount } = req.body; // Allow updating category and amount
    const budgetId = req.params.id;

    let budget = await Budget.findById(budgetId);

    if (!budget) {
        return next(new ErrorResponse(`Budget not found with id ${budgetId}`, 404));
    }

    // Verify user owns the budget
    if (budget.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to update this budget', 401));
    }

    // Prepare update data
    const updateData = {};
    if (category) updateData.category = category;
    if (amount !== undefined) { // Allow setting amount to 0 if needed, but validate > 0 in model
        if (amount <= 0) {
             return next(new ErrorResponse('Budget amount must be positive', 400));
        }
         updateData.amount = amount;
    }


    // Perform the update
    budget = await Budget.findByIdAndUpdate(budgetId, updateData, {
        new: true, // Return the modified document
        runValidators: true // Ensure new data meets schema requirements
    });

    res.status(200).json(budget);
});

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
exports.deleteBudget = asyncHandler(async (req, res, next) => {
     if (!req.user || !req.user.id) {
        return next(new ErrorResponse('Not authorized', 401));
    }

    const budgetId = req.params.id;
    const budget = await Budget.findById(budgetId);

    if (!budget) {
        return next(new ErrorResponse(`Budget not found with id ${budgetId}`, 404));
    }

    // Verify user owns the budget
    if (budget.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User not authorized to delete this budget', 401));
    }

    await budget.remove(); // Or budget.deleteOne() depending on Mongoose version

    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
    // Or res.status(204).send(); for No Content response
});
