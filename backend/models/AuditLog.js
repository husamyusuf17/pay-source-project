const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);
