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
const districtSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "District Conference is required"],
        trim: true,
    },
    annualConference: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Annual",
        index: true,
        required: [true, "Annual Conference is required"],
        trim: true,
    },
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
districtSchema.pre("save", async function (next) {
    const existingDistrictConference = await District.findOne({
        name: this.name,
        annualConference: this.annualConference,
    });
    if (existingDistrictConference) {
        const error = new Error("A district conference with this name and annual conference already exists.");
        next(error);
    }
    else {
        next();
    }
});
districtSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "District",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
districtSchema.post("findOneAndUpdate", async function (doc) {
    await Logs_1.default.create({
        action: "updated",
        collection: "District",
        documentId: doc._id,
        newData: doc.toObject(),
        timestamp: new Date(),
    });
});
districtSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "District",
            documentId: doc._id,
            data: doc.toObject(),
            timestamp: new Date(),
        });
    }
});
// [INDEX]
districtSchema.index({ annualConference: 1 });
// [EXPORT]
const District = (0, mongoose_1.model)("District", districtSchema);
exports.default = District;
//# sourceMappingURL=District.js.map