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
const historyValidator_1 = require("../validators/historyValidator");
const historyController_1 = require("../controllers/historyController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(historyController_1.getAllHistory))
    .post((0, authorize_1.authorize)(["local"]), (0, validate_1.validate)(historyValidator_1.createHistorySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(historyController_1.createHistory));
router
    .route("/:id")
    .get((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(historyController_1.getHistoryById))
    .put((0, authorize_1.authorize)(["local"]), (0, validate_1.validate)(historyValidator_1.updateHistorySchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(historyController_1.updateHistory))
    .delete((0, authorize_1.authorize)(["local"]), (0, asyncHandler_1.default)(historyController_1.deleteHistory));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=historyRoutes.js.map