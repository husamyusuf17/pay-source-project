const mongoose = require("mongoose");

const receivedItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantityReceived: { type: Number, required: true, min: 0 }
}, { _id: false });

const goodsReceiptSchema = new mongoose.Schema({
    grnNumber: { type: String, required: true, unique: true },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
    receivedItems: { type: [receivedItemSchema], required: true },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: String
}, { timestamps: true });

module.exports = mongoose.model("GoodsReceipt", goodsReceiptSchema);
