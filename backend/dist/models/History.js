"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Mongoose import
const mongoose_1 = require("mongoose");
// Local import
const Logs_1 = __importDefault(require("./Logs"));
// [SCHEMA]
const historySchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    historian: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Historian is required"],
        trim: true,
    },
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: [true, "Local Church is required"],
        index: true,
    },
    title: {
        type: String,
        required: [true, "History title is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "History content is required"],
        trim: true,
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    mediaLink: [
        {
            type: String,
        },
    ],
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
historySchema.post("save", async function (doc) {
    const historyId = doc === null || doc === void 0 ? void 0 : doc._id;
    await Logs_1.default.create({
        action: "created",
        collection: "History",
        documentId: historyId,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
historySchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "History",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
historySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "History",
            documentId: doc._id,
            data: doc.toObject(),
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const History = (0, mongoose_1.model)("History", historySchema);
exports.default = History;
//# sourceMappingURL=History.js.map