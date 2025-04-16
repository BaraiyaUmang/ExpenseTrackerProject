const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAdminStats,
    getTransactionAnalytics,
    getAllTransactions,
    getSettings,
    updateSettings
} = require("../controllers/admin/adminController");

const router = express.Router();

// All routes are protected by both auth and admin middleware
router.use(protect);
router.use(admin);

// 1. ADMIN DASHBOARD STATISTICS
router.get("/stats", getAdminStats);

// 2. USER MANAGEMENT
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// 3. TRANSACTION ANALYTICS
router.get("/transactions/analytics", getTransactionAnalytics);
router.get("/transactions", getAllTransactions);

// 4. ADMIN SETTINGS & CONFIGURATION
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router; 