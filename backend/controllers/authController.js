const authService = require("../services/authService");

const register = async (req, res, next) => {
    try { res.status(201).json(await authService.register(req.body)); } catch (e) { next(e); }
};
const login = async (req, res, next) => {
    try { res.json(await authService.login(req.body)); } catch (e) { next(e); }
};
const me = async (req, res) => res.json({ user: req.user });

module.exports = { register, login, me };
