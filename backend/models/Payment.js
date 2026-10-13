const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["COMPLETED"], default: "COMPLETED" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
