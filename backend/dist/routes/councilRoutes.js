"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
// [IMPORTS]
const councilValidator_1 = require("../validators/councilValidator");
const councilController_1 = require("../controllers/councilController");
const errorHandler_1 = require("../middleware/errorHandler");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validate_1 = require("../middleware/validate");
const validateLocalChurch_1 = require("../middleware/validateLocalChurch");
const validateDistrictConference_1 = require("../middleware/validateDistrictConference");
const validateAnnualConference_1 = require("../middleware/validateAnnualConference");
const router = express_1.default.Router();
// [ROUTES]
router
    .route("/")
    .get((0, asyncHandler_1.default)(councilController_1.getAllCouncil))
    .post((0, validate_1.validate)(councilValidator_1.createCouncilSchema), validateAnnualConference_1.validateAnnualConference, validateDistrictConference_1.validateDistrictConference, validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(councilController_1.createCouncil));
router
    .route("/:id")
    .get((0, asyncHandler_1.default)(councilController_1.getCouncilById))
    .put((0, validate_1.validate)(councilValidator_1.updateCouncilSchema), validateAnnualConference_1.validateAnnualConference, validateDistrictConference_1.validateDistrictConference, validateLocalChurch_1.validateLocalChurch, (0, asyncHandler_1.default)(councilController_1.updateCouncil))
    .delete((0, asyncHandler_1.default)(councilController_1.deleteCouncil));
router.use(errorHandler_1.errorHandler);
// [EXPORT]
exports.default = router;
//# sourceMappingURL=councilRoutes.js.map