const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const PurchaseOrder = require("../models/PurchaseOrder");
const PurchaseRequest = require("../models/PurchaseRequest");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const create = async (invoiceId, user) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new AppError("Invoice not found", 404);
    if (invoice.status !== "MATCHED") throw new AppError("Only a matched invoice can be paid", 400);
    const existing = await Payment.findOne({ invoice: invoice._id });
    if (existing) throw new AppError("Invoice is already paid", 409);

    const payment = await Payment.create({ invoice: invoice._id, amount: invoice.amount, paidBy: user._id });
    invoice.status = "PAID";
    await invoice.save();
    const po = await PurchaseOrder.findById(invoice.purchaseOrder);
    if (po) {
        po.status = "PAID";
        await po.save();
        const request = await PurchaseRequest.findById(po.purchaseRequest);
        if (request) { request.status = "PAID"; await request.save(); }
    }
    await writeAudit({ actor: user._id, action: "PAYMENT_COMPLETED", entityType: "Payment", entityId: payment._id });
    return payment;
};

module.exports = { create };
