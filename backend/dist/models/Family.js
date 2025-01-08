"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Mongoose imports
const mongoose_1 = require("mongoose");
const Logs_1 = __importDefault(require("./Logs"));
// [SCHEMA]
const familySchema = new mongoose_1.Schema({
    familyName: {
        type: String,
        required: [true, "Family name is required"],
        trim: true,
    },
    father: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
    },
    mother: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
    },
    weddingDate: {
        type: Date,
    },
    children: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Membership",
        },
    ],
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: [true, "Local Church is required"],
        index: true,
    },
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
familySchema.post("save", async function (doc) {
    const familyId = doc === null || doc === void 0 ? void 0 : doc._id;
    await Logs_1.default.create({
        action: "created",
        collection: "Family",
        documentId: doc._id,
        data: doc.toObject(),
        performedBy: doc._id,
        timestamp: new Date(),
    });
});
familySchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "Family",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
familySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Family",
            documentId: doc._id,
            data: doc.toObject(),
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const Family = (0, mongoose_1.model)("Family", familySchema);
exports.default = Family;
//# sourceMappingURL=Family.js.map