const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        icon: { type: String },
        source: { type: String, required: true }, // Example: Salary, Freelance, etc.
        description: { type: String, default: "" },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR", required: true },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Income", IncomeSchema);
