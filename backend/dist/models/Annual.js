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
const annualSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    episcopalArea: {
        type: String,
        enum: ["bea", "dea", "mea"],
        required: [true, "Episcopal Area is required"],
        index: true,
        trim: true,
    },
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
annualSchema.pre("save", async function (next) {
    const existingAnnualConference = await Annual.findOne({
        name: this.name,
        episcopalArea: this.episcopalArea,
    });
    if (existingAnnualConference) {
        const error = new Error("An annual conference with this this name and episcopal area already exists.");
        next(error);
    }
    else {
        next();
    }
});
annualSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "Annual",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
annualSchema.post("findOneAndUpdate", async function (doc) {
    await Logs_1.default.create({
        action: "updated",
        collection: "Annual",
        documentId: doc._id,
        newData: doc.toObject(),
        timestamp: new Date(),
    });
});
annualSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Annual",
            documentId: doc._id,
            data: doc.toObject(),
            timestamp: new Date(),
        });
    }
});
// [INDEX]
annualSchema.index({ episcopalArea: 1 });
// [EXPORT]
const Annual = (0, mongoose_1.model)("Annual", annualSchema);
exports.default = Annual;
//# sourceMappingURL=Annual.js.map