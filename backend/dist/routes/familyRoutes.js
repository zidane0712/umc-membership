"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORT]
// Global import
const express_1 = __importDefault(require("express"));
// Local import
const authorize_1 = require("../middleware/authorize");
const familyValidator_1 = require("../validators/familyValidator");
const familyController_1 = require("../controllers/familyController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(familyController_1.getAllFamily))
    .post((0, authorize_1.authorize)(["local"]), (0, validate_1.validate)(familyValidator_1.createFamilySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(familyController_1.createFamily));
router
    .route("/:id")
    .get((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(familyController_1.getFamilyById))
    .put((0, authorize_1.authorize)(["local"]), (0, validate_1.validate)(familyValidator_1.updateFamilySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(familyController_1.updateFamily))
    .delete((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(familyController_1.deleteFamily));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=familyRoutes.js.map