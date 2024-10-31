"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Custom error classes
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "CustomError";
    }
}
class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
        this.name = "ValidationError";
    }
}
class DatabaseError extends CustomError {
    constructor(message) {
        super(message, 500);
        this.name = "DatabaseError";
    }
}
// [MIDDLEWARES]
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Default to 500 if error type is unknown
    res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map