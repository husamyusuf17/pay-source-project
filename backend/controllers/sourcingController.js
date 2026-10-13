const service = require("../services/sourcingService");
const createRFQ = async (req, res, next) => { try { res.status(201).json({ data: await service.createRFQ(req.body, req.user) }); } catch (e) { next(e); } };
const listRFQs = async (req, res, next) => { try { res.json({ data: await service.listRFQs() }); } catch (e) { next(e); } };
const submitOffer = async (req, res, next) => { try { res.status(201).json({ data: await service.submitOffer(req.params.id, req.body, req.user) }); } catch (e) { next(e); } };
const listOffers = async (req, res, next) => { try { res.json({ data: await service.listOffers(req.params.id) }); } catch (e) { next(e); } };
const awardOffer = async (req, res, next) => { try { res.json({ data: await service.awardOffer(req.params.id, req.params.offerId, req.user) }); } catch (e) { next(e); } };
module.exports = { createRFQ, listRFQs, submitOffer, listOffers, awardOffer };
