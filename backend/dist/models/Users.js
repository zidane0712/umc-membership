"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORT]
// Global imports
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Logs_1 = __importDefault(require("./Logs"));
// [ENUM]
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["LOCAL"] = "local";
    Role["DISCTRICT"] = "district";
    Role["ANNUAL"] = "annual";
    Role["NATIONAL"] = "national";
})(Role || (Role = {}));
// [SCHEMA]
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
    },
    localChurch: {
        types: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: function () {
            return this.role === Role.LOCAL;
        },
    },
    district: {
        types: mongoose_1.Schema.Types.ObjectId,
        ref: "District",
        required: function () {
            return this.role === Role.DISCTRICT;
        },
    },
    annual: {
        types: mongoose_1.Schema.Types.ObjectId,
        ref: "Annual",
        required: function () {
            return this.role === Role.ANNUAL;
        },
    },
}, { timestamps: true });
// [MIDDLEWARE]
// Password hashing
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password"))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    user.password = await bcrypt_1.default.hash(user.password, salt);
    next();
});
// Logging middleware
userSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "User",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
userSchema.post("findOneAndUpdate", async function (doc) {
    await Logs_1.default.create({
        action: "updated",
        collection: "User",
        documentId: doc._id,
        newData: doc.toObject(),
        timestamp: new Date(),
    });
});
userSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "User",
            documentId: doc._id,
            data: doc.toObject(),
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=Users.js.map