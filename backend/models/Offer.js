const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryDays: { type: Number, required: true, min: 0 },
    warrantyMonths: { type: Number, default: 0, min: 0 },
    paymentTerms: { type: String, default: "Net 30" },
    status: { type: String, enum: ["SUBMITTED", "AWARDED", "REJECTED"], default: "SUBMITTED" }
}, { timestamps: true });

offerSchema.index({ rfq: 1, supplier: 1 }, { unique: true });

module.exports = mongoose.model("Offer", offerSchema);
