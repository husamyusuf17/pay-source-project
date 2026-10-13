const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    estimatedUnitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const approvalSchema = new mongoose.Schema({
    role: { type: String, required: true },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decision: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    decidedAt: Date,
    comment: String
}, { _id: false });

const purchaseRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: true },
    reason: { type: String, required: true },
    items: { type: [itemSchema], validate: [(value) => value.length > 0, "At least one item is required"] },
    estimatedAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["PENDING_APPROVAL", "APPROVED", "REJECTED", "SOURCING", "PO_CREATED", "RECEIVED", "INVOICED", "PAID"],
        default: "PENDING_APPROVAL"
    },
    approvals: { type: [approvalSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("PurchaseRequest", purchaseRequestSchema);
