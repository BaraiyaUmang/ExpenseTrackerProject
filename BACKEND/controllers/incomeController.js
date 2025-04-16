// const User = require("../models/User");
const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const { icon, source, amount, date } = req.body;
    
        // Validation: Check for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            currency: "INR", // Explicitly set currency to INR
            date: new Date(date),
        });
    
        await newIncome.save();
        res.status(200).json(newIncome);
    }     catch (error) {
        console.error("Error saving income:", error); // Log the exact error
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(income);
    } catch (error) {
        console.error("Error fetching income:", error); // Log the exact error
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Income deleted successfully" });

    } catch(error) {
        res.status(500).json({message:"server error"})
    }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
        Source: item.source,
        Amount: item.amount,
        Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, 'income_details.xlsx');
    res.download('income_details.xlsx');
} catch (error) {
    res.status(500).json({
        message: "Server Error"
    });
}
};
