const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid MongoDB id" });
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message).join(", ");
        return res.status(400).json({ message });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: "Duplicate value" });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal server error"
    });
};

module.exports = { notFound, errorHandler };
