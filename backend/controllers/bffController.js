const service = require("../services/bffService");
const dashboard = async (req, res, next) => { try { res.json({ data: await service.dashboard(req.user) }); } catch (e) { next(e); } };
const requestDetails = async (req, res, next) => { try { res.json({ data: await service.requestDetails(req.params.id) }); } catch (e) { next(e); } };
module.exports = { dashboard, requestDetails };
