const Supplier = require("../models/Supplier");
const writeAudit = require("../utils/audit");

const create = async (data, user) => {
    const supplier = await Supplier.create(data);
    await writeAudit({ actor: user._id, action: "SUPPLIER_CREATED", entityType: "Supplier", entityId: supplier._id });
    return supplier;
};

const list = () => Supplier.find().sort({ name: 1 });

module.exports = { create, list };
