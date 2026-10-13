const RFQ = require("../models/RFQ");
const Offer = require("../models/Offer");
const PurchaseRequest = require("../models/PurchaseRequest");
const Supplier = require("../models/Supplier");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const createRFQ = async (data, user) => {
    const request = await PurchaseRequest.findById(data.purchaseRequestId);
    if (!request) throw new AppError("Purchase request not found", 404);
    if (request.status !== "APPROVED") throw new AppError("Only approved requests can enter sourcing", 400);
    if (!Array.isArray(data.supplierIds) || data.supplierIds.length === 0) throw new AppError("At least one supplier is required", 400);

    const supplierCount = await Supplier.countDocuments({ _id: { $in: data.supplierIds }, status: "ACTIVE" });
    if (supplierCount !== data.supplierIds.length) throw new AppError("One or more suppliers are invalid or inactive", 400);

    const rfq = await RFQ.create({
        purchaseRequest: request._id,
        suppliers: data.supplierIds,
        deadline: data.deadline,
        notes: data.notes,
        createdBy: user._id
    });
    request.status = "SOURCING";
    await request.save();
    await writeAudit({ actor: user._id, action: "RFQ_CREATED", entityType: "RFQ", entityId: rfq._id });
    return rfq;
};

const listRFQs = () => RFQ.find().populate("purchaseRequest suppliers awardedOffer").sort({ createdAt: -1 });

const submitOffer = async (rfqId, data, user) => {
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) throw new AppError("RFQ not found", 404);
    if (rfq.status !== "OPEN") throw new AppError("Offers can only be submitted to an open RFQ", 400);
    if (!rfq.suppliers.some((id) => id.toString() === data.supplierId)) throw new AppError("Supplier was not invited to this RFQ", 400);

    const offer = await Offer.create({
        rfq: rfq._id,
        supplier: data.supplierId,
        totalAmount: data.totalAmount,
        deliveryDays: data.deliveryDays,
        warrantyMonths: data.warrantyMonths,
        paymentTerms: data.paymentTerms
    });
    await writeAudit({ actor: user._id, action: "OFFER_SUBMITTED", entityType: "Offer", entityId: offer._id });
    return offer;
};

const listOffers = (rfqId) => Offer.find({ rfq: rfqId }).populate("supplier", "name rating category").sort({ totalAmount: 1 });

const awardOffer = async (rfqId, offerId, user) => {
    const [rfq, offer] = await Promise.all([RFQ.findById(rfqId), Offer.findById(offerId)]);
    if (!rfq) throw new AppError("RFQ not found", 404);
    if (!offer || offer.rfq.toString() !== rfq._id.toString()) throw new AppError("Offer does not belong to this RFQ", 400);
    if (rfq.status !== "OPEN") throw new AppError("RFQ is not open", 400);

    await Offer.updateMany({ rfq: rfq._id }, { $set: { status: "REJECTED" } });
    offer.status = "AWARDED";
    await offer.save();
    rfq.status = "AWARDED";
    rfq.awardedOffer = offer._id;
    await rfq.save();
    await writeAudit({ actor: user._id, action: "OFFER_AWARDED", entityType: "Offer", entityId: offer._id, details: { rfqId } });
    return { rfq, offer };
};

module.exports = { createRFQ, listRFQs, submitOffer, listOffers, awardOffer };
