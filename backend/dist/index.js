"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [DEPENDENCIES]
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// [IMPORTS]\
const errorHandler_1 = require("./middleware/errorHandler");
const membershipRoutes_1 = __importDefault(require("./routes/membershipRoutes"));
const annualRoutes_1 = __importDefault(require("./routes/annualRoutes"));
const districtRoutes_1 = __importDefault(require("./routes/districtRoutes"));
const localChurchRoutes_1 = __importDefault(require("./routes/localChurchRoutes"));
const ministriesRoutes_1 = __importDefault(require("./routes/ministriesRoutes"));
const councilRoutes_1 = __importDefault(require("./routes/councilRoutes"));
const familyRoutes_1 = __importDefault(require("./routes/familyRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const historyRoutes_1 = __importDefault(require("./routes/historyRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const initialUser_1 = require("./utils/initialUser");
// [APP CONFIGURATION]
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// [MIDDLEWARES]
app.use(express_1.default.json()); // To parse JSON bodies
app.use((0, cors_1.default)()); // To handle requests from different origins
app.use(express_1.default.urlencoded({ extended: true })); // To parse URL-encoded bodies
// [MONGOOSE DB CONNECTION]
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(async () => {
    console.log("Connection open");
    // Create the initial admin user
    await (0, initialUser_1.createInitialAdmin)();
})
    .catch((err) => {
    console.log("Connection error");
    console.log(err);
});
// [ROUTES]
app.use("/membership", membershipRoutes_1.default);
app.use("/annual", annualRoutes_1.default);
app.use("/district", districtRoutes_1.default);
app.use("/localChurch", localChurchRoutes_1.default);
app.use("/ministry", ministriesRoutes_1.default);
app.use("/council", councilRoutes_1.default);
app.use("/family", familyRoutes_1.default);
app.use("/attendance", attendanceRoutes_1.default);
app.use("/history", historyRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("/logs", logRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// [LISTENER]
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map