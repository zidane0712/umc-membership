"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const annualValidator_1 = require("../validators/annualValidator");
const annualController_1 = require("../controllers/annualController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
// [DECLARATION]
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, asyncHandler_1.default)(annualController_1.getAllAnnual))
    .post((0, validate_1.validate)(annualValidator_1.createAnnualSchema), (0, asyncHandler_1.default)(annualController_1.createAnnual));
router
    .route("/:id")
    .get((0, asyncHandler_1.default)(annualController_1.getAnnualById))
    .put((0, validate_1.validate)(annualValidator_1.updateAnnualSchema), (0, asyncHandler_1.default)(annualController_1.updateAnnual))
    .delete((0, asyncHandler_1.default)(annualController_1.deleteAnnual));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=annualRoutes.js.map