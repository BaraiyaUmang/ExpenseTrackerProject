const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    currencyFormat: { type: String, default: "INR" },
    availableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema); 