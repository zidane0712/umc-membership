"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORT]
// Global import
const express_1 = __importDefault(require("express"));
// Local import
const attendanceValidator_1 = require("../validators/attendanceValidator");
const attendanceController_1 = require("../controllers/attendanceController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, asyncHandler_1.default)(attendanceController_1.getAllAttendance))
    .post((0, validate_1.validate)(attendanceValidator_1.createAttendanceSchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(attendanceController_1.createAttendance));
router
    .route("/:id")
    .get((0, asyncHandler_1.default)(attendanceController_1.getAttendanceById))
    .put((0, validate_1.validate)(attendanceValidator_1.updateAttendanceSchema), validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(attendanceController_1.updateAttendance))
    .delete((0, asyncHandler_1.default)(attendanceController_1.deleteAttendance));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map