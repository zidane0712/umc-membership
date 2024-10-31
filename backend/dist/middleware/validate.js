"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const mongoose_1 = require("mongoose");
// [FUNCTION]
const validate = (schema) => {
    return (req, res, next) => {
        // Perform Joi validation
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map((err) => err.message),
            });
        }
        // Perform ObjectId validation for the "annualConference" field
        const { annualConference } = req.body;
        if (annualConference && typeof annualConference === "string") {
            req.body.annualConference = annualConference.trim(); // Trim spaces
            if (!mongoose_1.Types.ObjectId.isValid(req.body.annualConference)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Annual Conference ID format.",
                });
            }
        }
        // Perform ObjectId validation for the "district" field
        const { district } = req.body;
        if (district && typeof district === "string") {
            req.body.district = district.trim(); // Trim spaces
            if (!mongoose_1.Types.ObjectId.isValid(req.body.district)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid District Conference ID format.",
                });
            }
        }
        // Perform ObjectId validation for the "localChurch" field
        const { localChurch } = req.body;
        if (localChurch && typeof localChurch === "string") {
            req.body.localChurch = localChurch.trim(); // Trim spaces
            if (!mongoose_1.Types.ObjectId.isValid(req.body.localChurch)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Local Church ID format.",
                });
            }
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map