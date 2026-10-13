const service = require("../services/receivingService");
const create = async (req, res, next) => { try { res.status(201).json({ data: await service.create(req.body, req.user) }); } catch (e) { next(e); } };
const list = async (req, res, next) => { try { res.json({ data: await service.list() }); } catch (e) { next(e); } };
module.exports = { create, list };
