const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const createToken = (user) => jwt.sign(
    { role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
);

const register = async ({ name, email, password, department }) => {
    if (!name || !email || !password) throw new AppError("name, email and password are required", 400);
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new AppError("Email is already registered", 409);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, department, role: "REQUESTER" });
    return { user: sanitize(user), token: createToken(user) };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
        throw new AppError("Invalid email or password", 401);
    }
    return { user: sanitize(user), token: createToken(user) };
};

const sanitize = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department
});

module.exports = { register, login, sanitize };
