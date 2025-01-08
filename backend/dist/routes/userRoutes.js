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
const userValidator_1 = require("../validators/userValidator");
const userController_1 = require("../controllers/userController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const validateDistrictConference_1 = require("../middleware/validateDistrictConference");
const validateAnnualConference_1 = require("../middleware/validateAnnualConference");
const router = express_1.default.Router();
// [ROUTES]
// router.route("/").get(authorize(["admin"]),asyncHandler(getAllUser))
router.route("/login").post((0, asyncHandler_1.default)(userController_1.loginUser));
router
    .route("/")
    .get((0, authorize_1.authorize)(["admin"]), (0, asyncHandler_1.default)(userController_1.getAllUser))
    .post((0, authorize_1.authorize)(["admin"]), (0, validate_1.validate)(userValidator_1.createUserSchema), validateLocalChurch_1.validateLocalChurch, validateDistrictConference_1.validateDistrictConference, validateAnnualConference_1.validateAnnualConference, (0, asyncHandler_1.default)(userController_1.createUser));
router
    .route("/:id")
    .get((0, authorize_1.authorize)(["admin"]), (0, asyncHandler_1.default)(userController_1.getUserById))
    .put((0, authorize_1.authorize)(["admin"]), (0, validate_1.validate)(userValidator_1.updateUserSchema), validateAnnualConference_1.validateAnnualConference, validateDistrictConference_1.validateDistrictConference, validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(userController_1.updateUser))
    .delete((0, authorize_1.authorize)(["admin"]), (0, asyncHandler_1.default)(userController_1.deleteUser));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=userRoutes.js.map