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
// [IMPORTS]
// import membershipRoute from "";
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
    .then(() => console.log("Connection open"))
    .catch((err) => {
    console.log("Connection error");
    console.log(err);
});
// [ROUTES]
app.get("/", (req, res) => {
    res.send("API is running...");
});
// [LISTENER]
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map