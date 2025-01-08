"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORTS]
// Mongoose imports
const mongoose_1 = require("mongoose");
const commonSchemas_1 = require("../schemas/commonSchemas");
const Logs_1 = __importDefault(require("./Logs"));
// [SCHEMA]
const localSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: { type: commonSchemas_1.addressSchema, required: true },
    district: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "District",
        required: [true, "District Conference is required"],
        index: true,
        trim: true,
    },
    contactNo: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^09\d{9}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid cellphone number`,
        },
    },
    anniversaryDate: {
        type: Date,
        required: [true, "Anniversary Date is required"],
        index: true,
    },
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
localSchema.pre("save", async function (next) {
    const existingLocalChurch = await Local.findOne({
        name: this.name,
        district: this.district,
    });
    if (existingLocalChurch) {
        const error = new Error("A local church with this name, district, and annual conference already exists.");
        next(error);
    }
    else {
        next();
    }
});
localSchema.post("save", async function (doc) {
    const localId = doc === null || doc === void 0 ? void 0 : doc._id;
    await Logs_1.default.create({
        action: "created",
        collection: "Local",
        documentId: localId,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
localSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "Local",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
localSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Local",
            documentId: doc._id,
            data: doc.toObject(),
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const Local = (0, mongoose_1.model)("Local", localSchema);
exports.default = Local;
//# sourceMappingURL=Local.js.map