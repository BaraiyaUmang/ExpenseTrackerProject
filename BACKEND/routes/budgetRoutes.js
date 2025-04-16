// routes/budgetRoutes.js
const express = require('express');
const {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');

// Assuming your auth middleware is named 'protect' or similar
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply the 'protect' middleware to all routes below
router.use(protect);

router.route('/')
    .get(getBudgets)
    .post(createBudget);

router.route('/:id')
    .put(updateBudget)
    .delete(deleteBudget);

module.exports = router;