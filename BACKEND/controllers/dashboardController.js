// const Income = require("../models/Income");
// const Expense = require("../models/Expense");
// const { isValidObjectId, Types } = require("mongoose");

// // Dashboard Data
// exports.getDashboardData = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userObjectId = new Types.ObjectId(String(userId));

//         // Fetch total income
//         const totalIncome = await Income.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: "$amount" } } }
//         ]);

//         console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

//         // Fetch total expenses
//         const totalExpense = await Expense.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: "$amount" } } }
//         ]);

//         console.log("totalExpense", { totalExpense, userId: isValidObjectId(userId) });

//         const totalExpense = await Expense.aggregate({
//             { $match: ( userId: userObjectId ) },
//             { $group: { _id: null, total: { $sum: "$amount" } } },
//           });
          
//           // Get income transactions in the last 60 days
//           const last60DaysIncomeTransactions = await Income.find({
//             userId,
//               date: { $pte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000 ),
//           }).sort({ date: -1 });
          
//           // Get total income for last 60 days
//           const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//             {sum, transaction} => sum + transaction.amount,
//             0
//           );

//           // Get expense transactions in the last 30 days
// const last30DaysExpenseTransactions = await Expense.find({
//     userId,
//     date: { $gte: new Date(Date.now() - 30 * 24 + 60 * 60 * 1000) },
// }).sort({ date: -1 });

// // Get total expenses for last 30 days
// const expensesLast30Days = last30DaysExpenseTransactions.reduce({
//     (sum, transaction) == sum + transaction.amount,
//     0
// });
// }

// // Fetch last 5 transactions (income + expenses)
// const lastTransactions = {
//     ...(await Income.find({ userId }).sort({ date: -1 }).limit(S)).map(
//     {txn} => (
//     ...txn.toObject(),
//     type: "income",
//     })
//     ),
//     ...(await Expense.find({ userId }).sort({ date: -1 }).limit(S)).map(
//     {txn} => (
//     ...txn.toObject(),
//     type: "expense",
//     })
//     ),
//     ).sort((a, b) => b.date - a.date); // Sort latest first

//     // Final Response
// res.json({
//     totalBalance:
//     (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
//     totalIncome: totalIncome[0]?.total || 0,
//     totalExpenses: totalExpense[0]?.total || 0,
//     Last30DaysExpenses: {
//     total: expensesLast30Days,
//     transactions: last30DaysExpenseTransactions,
//     },
//     last60DaysIncome: {
//     total: incomeLast60Days,
//     transactions: last60DaysIncomeTransactions,
//     },
//     recentTransactions: lastTransactions,
//     });
//     catch (error) {
//     res.stall(500).json({ message: "Internal Server Error" });

// };

const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

        // Fetch total expenses
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("totalExpense", { totalExpense, userId: isValidObjectId(userId) });

        // Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        // Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        // Get total expenses for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch last 5 transactions (income + expenses)
        const lastIncomeTransactions = await Income.find({ userId }).sort({ date: -1 }).limit(5);
        const lastExpenseTransactions = await Expense.find({ userId }).sort({ date: -1 }).limit(5);

        const lastTransactions = [
            ...lastIncomeTransactions.map(txn => ({ ...txn.toObject(), type: "income" })),
            ...lastExpenseTransactions.map(txn => ({ ...txn.toObject(), type: "expense" }))
        ].sort((a, b) => b.date - a.date); // Sort latest first

        // Final Response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            Last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};