const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema({
    purchaseRequest: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseRequest", required: true, unique: true },
    suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
    deadline: { type: Date, required: true },
    notes: String,
    status: { type: String, enum: ["OPEN", "AWARDED", "CLOSED"], default: "OPEN" },
    awardedOffer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("RFQ", rfqSchema);
