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
const attendanceSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    activityName: {
        type: String,
        required: [true, "Activity name is required"],
        trim: true,
    },
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: [true, "Local Church is required"],
        index: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    totalAttendees: {
        type: Number,
        required: [true, "Total number of attendees is required"],
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
attendanceSchema.post("save", async function (doc) {
    const attendanceId = doc === null || doc === void 0 ? void 0 : doc._id;
    await Logs_1.default.create({
        action: "created",
        collection: "Attendance",
        documentId: attendanceId,
        data: doc.toObject(),
        performedBy: doc._id,
        timestamp: new Date(),
    });
});
attendanceSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        // Fetch previous data before update
        const prevData = doc.toObject();
        await Logs_1.default.create({
            action: "updated",
            collection: "Attendance",
            documentId: doc._id,
            data: { prevData, newData: this.getUpdate() },
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
attendanceSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Attendance",
            documentId: doc._id,
            data: doc.toObject(),
            performedBy: this.getQuery()._id,
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const Attendance = (0, mongoose_1.model)("Attendance", attendanceSchema);
exports.default = Attendance;
//# sourceMappingURL=Attendance.js.map