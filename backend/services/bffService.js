const PurchaseRequest = require("../models/PurchaseRequest");
const Supplier = require("../models/Supplier");
const RFQ = require("../models/RFQ");
const Offer = require("../models/Offer");
const PurchaseOrder = require("../models/PurchaseOrder");
const GoodsReceipt = require("../models/GoodsReceipt");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const AppError = require("../utils/AppError");

const dashboard = async (user) => {
    const requestFilter = user.role === "REQUESTER" ? { requester: user._id } : {};
    const [requests, pendingApprovals, suppliers, openRfqs, openPos, unmatchedInvoices] = await Promise.all([
        PurchaseRequest.countDocuments(requestFilter),
        PurchaseRequest.countDocuments({ status: "PENDING_APPROVAL" }),
        Supplier.countDocuments({ status: "ACTIVE" }),
        RFQ.countDocuments({ status: "OPEN" }),
        PurchaseOrder.countDocuments({ status: { $in: ["ISSUED", "PARTIALLY_RECEIVED"] } }),
        Invoice.countDocuments({ status: { $in: ["SUBMITTED", "MISMATCH"] } })
    ]);
    return { requests, pendingApprovals, suppliers, openRfqs, openPos, unmatchedInvoices };
};

const requestDetails = async (id) => {
    const request = await PurchaseRequest.findById(id).populate("requester", "name email department role");
    if (!request) throw new AppError("Purchase request not found", 404);
    const rfq = await RFQ.findOne({ purchaseRequest: request._id }).populate("suppliers awardedOffer");
    const offers = rfq ? await Offer.find({ rfq: rfq._id }).populate("supplier", "name rating") : [];
    const po = rfq ? await PurchaseOrder.findOne({ rfq: rfq._id }).populate("supplier offer") : null;
    const grns = po ? await GoodsReceipt.find({ purchaseOrder: po._id }) : [];
    const invoice = po ? await Invoice.findOne({ purchaseOrder: po._id }) : null;
    const payment = invoice ? await Payment.findOne({ invoice: invoice._id }) : null;
    return { request, rfq, offers, purchaseOrder: po, goodsReceipts: grns, invoice, payment };
};

module.exports = { dashboard, requestDetails };
