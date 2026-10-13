const service = require("../services/paymentService");
const create = async (req, res, next) => { try { res.status(201).json({ data: await service.create(req.params.invoiceId, req.user) }); } catch (e) { next(e); } };
module.exports = { create };
