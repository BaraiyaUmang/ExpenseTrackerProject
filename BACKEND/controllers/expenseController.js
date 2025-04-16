// const User = require("../models/User");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");


// Add Expense Source
exports.addExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const { icon, category, amount, date } = req.body;
    
        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            currency: "INR", // Explicitly set currency to INR
            date: new Date(date),
        });
    
        await newExpense.save();
        res.status(200).json(newExpense);
    }     catch (error) {
        console.error("Error saving income:", error); // Log the exact error
        res.status(500).json({ message: "Server Error", error: error.message });
    }

};

// Get all Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expense);
    } catch (error) {
        console.error("Error fetching expense:", error); // Log the exact error
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });

    } catch(error) {
        res.status(500).json({message:"server error"})
    }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
        category: item.category,
        Amount: item.amount,
        Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "expense");
    xlsx.writeFile(wb, 'expense_details.xlsx');
    res.download('expense_details.xlsx');
} catch (error) {
    res.status(500).json({
        message: "Server Error"
    });
}
};
