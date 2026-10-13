const PurchaseOrder = require("../models/PurchaseOrder");
const RFQ = require("../models/RFQ");
const Offer = require("../models/Offer");
const PurchaseRequest = require("../models/PurchaseRequest");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const makeNumber = () => `PO-${Date.now()}`;

const createFromRFQ = async (rfqId, user) => {
    const rfq = await RFQ.findById(rfqId).populate("purchaseRequest");
    if (!rfq) throw new AppError("RFQ not found", 404);
    if (rfq.status !== "AWARDED" || !rfq.awardedOffer) throw new AppError("RFQ must have an awarded offer", 400);
    const existing = await PurchaseOrder.findOne({ rfq: rfq._id });
    if (existing) throw new AppError("Purchase order already exists for this RFQ", 409);

    const offer = await Offer.findById(rfq.awardedOffer);
    const request = await PurchaseRequest.findById(rfq.purchaseRequest._id);
    const totalQty = request.items.reduce((s, i) => s + i.quantity, 0);
    const unitPrice = totalQty ? offer.totalAmount / totalQty : 0;
    const items = request.items.map((i) => ({ description: i.description, quantity: i.quantity, unitPrice }));

    const po = await PurchaseOrder.create({
        poNumber: makeNumber(),
        purchaseRequest: request._id,
        rfq: rfq._id,
        offer: offer._id,
        supplier: offer.supplier,
        items,
        totalAmount: offer.totalAmount,
        createdBy: user._id
    });
    request.status = "PO_CREATED";
    await request.save();
    await writeAudit({ actor: user._id, action: "PURCHASE_ORDER_CREATED", entityType: "PurchaseOrder", entityId: po._id });
    return po;
};

const list = () => PurchaseOrder.find().populate("supplier purchaseRequest offer").sort({ createdAt: -1 });

module.exports = { createFromRFQ, list };
