const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["SUBMITTED", "MATCHED", "MISMATCH", "PAID"], default: "SUBMITTED" },
    matchResult: {
        poAmountMatches: Boolean,
        receivedQuantityMatches: Boolean,
        details: String,
        matchedAt: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
