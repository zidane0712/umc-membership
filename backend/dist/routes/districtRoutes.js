"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const authorize_1 = require("../middleware/authorize");
const districtValidator_1 = require("../validators/districtValidator");
const districtController_1 = require("../controllers/districtController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validateAnnualConference_1 = require("../middleware/validateAnnualConference");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, authorize_1.authorize)(["admin", "annual"], true), (0, asyncHandler_1.default)(districtController_1.getAllDistrict))
    .post((0, authorize_1.authorize)(["admin"], true), (0, validate_1.validate)(districtValidator_1.createDistrictSchema), validateAnnualConference_1.validateAnnualConference, (0, asyncHandler_1.default)(districtController_1.createDistrict));
// Route for annual
router
    .route("/:id")
    .get((0, authorize_1.authorize)(["admin", "annual"], true), (0, asyncHandler_1.default)(districtController_1.getDistrictById))
    .put((0, authorize_1.authorize)(["admin"]), (0, validate_1.validate)(districtValidator_1.updateDistrictSchema), validateAnnualConference_1.validateAnnualConference, (0, asyncHandler_1.default)(districtController_1.updateDistrict))
    .delete((0, authorize_1.authorize)(["admin"]), (0, asyncHandler_1.default)(districtController_1.deleteDistrict));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=districtRoutes.js.map