"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const authorize_1 = require("../middleware/authorize");
const localChurchValidator_1 = require("../validators/localChurchValidator");
const localChurchController_1 = require("../controllers/localChurchController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateDistrictConference_1 = require("../middleware/validateDistrictConference");
const validateAnnualConference_1 = require("../middleware/validateAnnualConference");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, authorize_1.authorize)(["admin", "annual", "district"], true), (0, asyncHandler_1.default)(localChurchController_1.getAllLocalChurch))
    .post((0, authorize_1.authorize)(["admin"], true), (0, validate_1.validate)(localChurchValidator_1.createLocalChurchSchema), validateDistrictConference_1.validateDistrictConference, validateAnnualConference_1.validateAnnualConference, (0, asyncHandler_1.default)(localChurchController_1.createLocalChurch));
router
    .route("/anniversaries")
    .get((0, authorize_1.authorize)(["admin", "annual", "district"], true), (0, asyncHandler_1.default)(localChurchController_1.getAnniversariesByMonth));
router
    .route("/:id")
    .get((0, authorize_1.authorize)(["admin", "annual", "district"], true), (0, asyncHandler_1.default)(localChurchController_1.getLocalChurchById))
    .put((0, authorize_1.authorize)(["admin"]), (0, validate_1.validate)(localChurchValidator_1.updateLocalChurchSchema), validateDistrictConference_1.validateDistrictConference, validateAnnualConference_1.validateAnnualConference, (0, asyncHandler_1.default)(localChurchController_1.updateLocalChurch))
    .delete((0, authorize_1.authorize)(["admin"]), (0, asyncHandler_1.default)(localChurchController_1.deleteLocalChurch));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=localChurchRoutes.js.map