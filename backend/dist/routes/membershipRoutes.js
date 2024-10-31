"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDECIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const membershipValidator_1 = require("../validators/membershipValidator");
const membershipController_1 = require("../controllers/membershipController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const validate_1 = require("../middleware/validate");
// [DECLARATION]
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, asyncHandler_1.default)(membershipController_1.getAllMemberships))
    .post((0, validate_1.validate)(membershipValidator_1.createMembershipSchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(membershipController_1.createMembership));
router
    .route("/:id")
    .get((0, asyncHandler_1.default)(membershipController_1.getMemberById))
    .put((0, validate_1.validate)(membershipValidator_1.updateMembershipSchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(membershipController_1.updateMember))
    .delete((0, asyncHandler_1.default)(membershipController_1.deleteMember));
router
    .route("/:id/ministry")
    .put((0, asyncHandler_1.default)(membershipController_1.addMinistriesToMember))
    .delete((0, asyncHandler_1.default)(membershipController_1.removeMinistriesFromMember));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=membershipRoutes.js.map