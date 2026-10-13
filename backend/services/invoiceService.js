const Invoice = require("../models/Invoice");
const PurchaseOrder = require("../models/PurchaseOrder");
const GoodsReceipt = require("../models/GoodsReceipt");
const PurchaseRequest = require("../models/PurchaseRequest");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const create = async (data, user) => {
    const po = await PurchaseOrder.findById(data.purchaseOrderId);
    if (!po) throw new AppError("Purchase order not found", 404);
    const invoice = await Invoice.create({
        invoiceNumber: data.invoiceNumber,
        purchaseOrder: po._id,
        supplier: po.supplier,
        amount: data.amount
    });
    po.status = "INVOICED";
    await po.save();
    const request = await PurchaseRequest.findById(po.purchaseRequest);
    if (request) { request.status = "INVOICED"; await request.save(); }
    await writeAudit({ actor: user._id, action: "INVOICE_CREATED", entityType: "Invoice", entityId: invoice._id });
    return invoice;
};

const match = async (invoiceId, user) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new AppError("Invoice not found", 404);
    const po = await PurchaseOrder.findById(invoice.purchaseOrder);
    const grns = await GoodsReceipt.find({ purchaseOrder: po._id });

    const poAmountMatches = Number(invoice.amount) === Number(po.totalAmount);
    const totals = {};
    for (const grn of grns) {
        for (const item of grn.receivedItems) totals[item.description] = (totals[item.description] || 0) + item.quantityReceived;
    }
    const receivedQuantityMatches = po.items.every((item) => (totals[item.description] || 0) >= item.quantity);
    const matched = poAmountMatches && receivedQuantityMatches;

    invoice.status = matched ? "MATCHED" : "MISMATCH";
    invoice.matchResult = {
        poAmountMatches,
        receivedQuantityMatches,
        details: matched ? "PO + GRN + Invoice match" : "Review amount and/or received quantities",
        matchedAt: new Date()
    };
    await invoice.save();
    await writeAudit({ actor: user._id, action: "INVOICE_MATCHED", entityType: "Invoice", entityId: invoice._id, details: invoice.matchResult });
    return invoice;
};

const list = () => Invoice.find().populate("purchaseOrder supplier").sort({ createdAt: -1 });

module.exports = { create, match, list };
