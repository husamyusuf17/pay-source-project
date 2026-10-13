const service = require("../services/purchaseRequestService");

const create = async (req, res, next) => { try { res.status(201).json({ data: await service.create(req.body, req.user) }); } catch (e) { next(e); } };
const list = async (req, res, next) => { try { res.json({ data: await service.list(req.user) }); } catch (e) { next(e); } };
const getById = async (req, res, next) => { try { res.json({ data: await service.getById(req.params.id) }); } catch (e) { next(e); } };
const approve = async (req, res, next) => { try { res.json({ data: await service.decide(req.params.id, "APPROVED", req.user, req.body.comment) }); } catch (e) { next(e); } };
const reject = async (req, res, next) => { try { res.json({ data: await service.decide(req.params.id, "REJECTED", req.user, req.body.comment) }); } catch (e) { next(e); } };

module.exports = { create, list, getById, approve, reject };
