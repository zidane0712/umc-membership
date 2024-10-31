"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Global import
const express_1 = __importDefault(require("express"));
// Local import
const logsController_1 = require("../controllers/logsController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const router = express_1.default.Router();
// [ROUTES]
router.route("/").get((0, asyncHandler_1.default)(logsController_1.getAllLogs));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=logRoutes.js.map