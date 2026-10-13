const AuditLog = require("../models/AuditLog");

const writeAudit = async ({ actor, action, entityType, entityId, details = {} }) => {
    await AuditLog.create({ actor, action, entityType, entityId, details });
};

module.exports = writeAudit;
