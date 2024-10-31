"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Global import
const mongoose_1 = __importStar(require("mongoose"));
// [SCHEMA]
const logSchema = new mongoose_1.Schema({
    action: {
        type: String,
        enum: ["created", "updated", "deleted"],
        required: true,
    },
    collection: { type: String, required: true },
    documentId: { type: mongoose_1.default.Types.ObjectId, required: true },
    data: { type: mongoose_1.Schema.Types.Mixed },
    performedBy: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
});
// [EXPORT]
const Log = mongoose_1.default.model("Log", logSchema);
exports.default = Log;
//# sourceMappingURL=Logs.js.map