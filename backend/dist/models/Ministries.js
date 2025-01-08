"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Mongoose imports
const mongoose_1 = require("mongoose");
// Local imports
const Membership_1 = __importDefault(require("./Membership"));
const Logs_1 = __importDefault(require("./Logs"));
// [SCHEMA]
const ministrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Ministry is required"],
        trim: true,
    },
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: [true, "Local Church is required"],
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Membership",
        },
    ],
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
ministrySchema.pre("findOneAndDelete", async function (next) {
    const ministryId = this.getQuery()["_id"];
    try {
        await Membership_1.default.updateMany({ ministries: ministryId }, { $pull: { ministries: ministryId } });
        next();
    }
    catch (err) {
        next(err);
    }
});
ministrySchema.post("save", async function (doc) {
    const ministryId = doc === null || doc === void 0 ? void 0 : doc._id;
    await Logs_1.default.create({
        action: "created",
        collection: "Ministry",
        documentId: doc._id,
        data: doc.toObject(),
        performedBy: doc._id,
        timestamp: new Date(),
    });
});
ministrySchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "Ministry",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
ministrySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Ministry",
            documentId: doc._id,
            data: doc.toObject(),
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const Ministry = (0, mongoose_1.model)("Ministry", ministrySchema);
exports.default = Ministry;
//# sourceMappingURL=Ministries.js.map