"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [IMPORT]
// Global imports
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Local imports
const Logs_1 = __importDefault(require("./Logs"));
// [ENUM]
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["LOCAL"] = "local";
    Role["DISTRICT"] = "district";
    Role["ANNUAL"] = "annual";
    Role["NATIONAL"] = "national";
})(Role || (Role = {}));
// [SCHEMA]
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
    },
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: function () {
            return this.role === Role.LOCAL;
        },
    },
    district: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "District",
        required: function () {
            return this.role === Role.DISTRICT;
        },
    },
    annual: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Annual",
        required: function () {
            return this.role === Role.ANNUAL;
        },
    },
    customId: { type: String, unique: true },
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
// Logging middleware for user creation
userSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "User",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
// Logging middleware for user updates
userSchema.post("findOneAndUpdate", async function (doc) {
    console.log("User updated document:", doc);
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "User",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            timestamp: new Date(),
        });
    }
});
// Logging middleware for user deletion
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