"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const ministryValidator_1 = require("../validators/ministryValidator");
const ministriesController_1 = require("../controllers/ministriesController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, asyncHandler_1.default)(ministriesController_1.getAllMinistry))
    .post((0, validate_1.validate)(ministryValidator_1.createMinistrySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(ministriesController_1.createMinistry));
router
    .route("/:id")
    .get((0, asyncHandler_1.default)(ministriesController_1.getMinistryById))
    .put((0, validate_1.validate)(ministryValidator_1.updateMinistrySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(ministriesController_1.updateMinistry))
    .delete((0, asyncHandler_1.default)(ministriesController_1.deleteMinistry));
router
    .route("/:id/members")
    .put((0, asyncHandler_1.default)(ministriesController_1.addMemberToMinistry))
    .delete((0, asyncHandler_1.default)(ministriesController_1.removeMembersFromMinistry));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=ministriesRoutes.js.map