const PurchaseRequest = require("../models/PurchaseRequest");
const AppError = require("../utils/AppError");
const writeAudit = require("../utils/audit");

const calculateEstimatedAmount = (items) => (items || []).reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.estimatedUnitPrice), 0
);

const requiredApprovals = (amount) => {
    if (amount > 10000) return ["MANAGER", "FINANCE"];
    return ["MANAGER"];
};

const create = async (data, user) => {
    const estimatedAmount = calculateEstimatedAmount(data.items);
    const approvals = requiredApprovals(estimatedAmount).map((role) => ({ role }));
    const request = await PurchaseRequest.create({
        requester: user._id,
        department: data.department || user.department,
        reason: data.reason,
        items: data.items,
        estimatedAmount,
        approvals
    });
    await writeAudit({ actor: user._id, action: "PURCHASE_REQUEST_CREATED", entityType: "PurchaseRequest", entityId: request._id });
    return request;
};

const list = async (user) => {
    const filter = user.role === "REQUESTER" ? { requester: user._id } : {};
    return PurchaseRequest.find(filter).populate("requester", "name email role department").sort({ createdAt: -1 });
};

const getById = async (id) => {
    const request = await PurchaseRequest.findById(id).populate("requester", "name email role department");
    if (!request) throw new AppError("Purchase request not found", 404);
    return request;
};

const decide = async (id, decision, user, comment = "") => {
    const request = await PurchaseRequest.findById(id);
    if (!request) throw new AppError("Purchase request not found", 404);
    if (request.status !== "PENDING_APPROVAL") throw new AppError("Only pending purchase requests can be decided", 400);
    if (request.requester.toString() === user._id.toString()) throw new AppError("Requester cannot approve or reject their own request", 403);

    const approval = request.approvals.find((a) => a.role === user.role && a.decision === "PENDING");
    if (!approval && user.role !== "ADMIN") throw new AppError("No pending approval is assigned to your role", 403);

    if (approval) {
        approval.approver = user._id;
        approval.decision = decision;
        approval.decidedAt = new Date();
        approval.comment = comment;
    }

    if (decision === "REJECTED") {
        request.status = "REJECTED";
    } else {
        const allApproved = request.approvals.every((a) => a.decision === "APPROVED");
        if (allApproved || user.role === "ADMIN") request.status = "APPROVED";
    }

    await request.save();
    await writeAudit({ actor: user._id, action: `PURCHASE_REQUEST_${decision}`, entityType: "PurchaseRequest", entityId: request._id, details: { comment } });
    return request;
};

module.exports = { create, list, getById, decide };
