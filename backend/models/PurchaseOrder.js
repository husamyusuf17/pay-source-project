const mongoose = require("mongoose");

const poItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const purchaseOrderSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    purchaseRequest: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseRequest", required: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true, unique: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: { type: [poItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["ISSUED", "PARTIALLY_RECEIVED", "RECEIVED", "INVOICED", "PAID"], default: "ISSUED" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
