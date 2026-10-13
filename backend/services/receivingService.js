const GoodsReceipt = require("../models/GoodsReceipt");
const PurchaseOrder = require("../models/PurchaseOrder");
const PurchaseRequest = require("../models/PurchaseRequest");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const makeNumber = () => `GRN-${Date.now()}`;

const create = async (data, user) => {
    const po = await PurchaseOrder.findById(data.purchaseOrderId);
    if (!po) throw new AppError("Purchase order not found", 404);
    if (["PAID"].includes(po.status)) throw new AppError("Cannot receive against a paid order", 400);

    const grn = await GoodsReceipt.create({
        grnNumber: makeNumber(),
        purchaseOrder: po._id,
        receivedItems: data.receivedItems,
        note: data.note,
        receivedBy: user._id
    });

    const allGrns = await GoodsReceipt.find({ purchaseOrder: po._id });
    const totals = {};
    for (const g of allGrns) {
        for (const item of g.receivedItems) totals[item.description] = (totals[item.description] || 0) + item.quantityReceived;
    }
    const fullyReceived = po.items.every((item) => (totals[item.description] || 0) >= item.quantity);
    po.status = fullyReceived ? "RECEIVED" : "PARTIALLY_RECEIVED";
    await po.save();

    const request = await PurchaseRequest.findById(po.purchaseRequest);
    if (fullyReceived && request) {
        request.status = "RECEIVED";
        await request.save();
    }

    await writeAudit({ actor: user._id, action: "GRN_CREATED", entityType: "GoodsReceipt", entityId: grn._id });
    return grn;
};

const list = () => GoodsReceipt.find().populate("purchaseOrder receivedBy", "poNumber name email").sort({ createdAt: -1 });

module.exports = { create, list };
