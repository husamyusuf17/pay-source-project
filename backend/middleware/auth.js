const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const [scheme, token] = header.split(" ");

        if (scheme !== "Bearer" || !token) {
            throw new AppError("Authentication required", 401);
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).select("-passwordHash");

        if (!user || !user.active) {
            throw new AppError("User is not available", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new AppError("Invalid or expired token", 401));
        }
        next(error);
    }
};

const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission for this action", 403));
    }
    next();
};

module.exports = { authenticate, authorize };
