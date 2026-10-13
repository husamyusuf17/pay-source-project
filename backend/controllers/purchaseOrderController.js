const service = require("../services/purchaseOrderService");
const createFromRFQ = async (req, res, next) => { try { res.status(201).json({ data: await service.createFromRFQ(req.params.rfqId, req.user) }); } catch (e) { next(e); } };
const list = async (req, res, next) => { try { res.json({ data: await service.list() }); } catch (e) { next(e); } };
module.exports = { createFromRFQ, list };
