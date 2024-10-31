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
const administrativeOfficeSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Council Chairperson is required"],
    },
    layLeader: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Lay Leader is required"],
    },
    layDelegate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Lay Delegate is required"],
    },
    recordingSecretary: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Recording Secretary is required"],
    },
    membershipSecretary: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Membership Secretary is required"],
    },
    assistantSecretary: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Assistant Secretary is required"],
    },
    spprcChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "SPPRC Chairperson is required"],
    },
    botChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "BOT Chairperson is required"],
    },
    viceChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "ViceChairperson is required"],
    },
    umyfPresident: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "UMYF President is required"],
    },
    umyafPresident: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "UMYAF President is required"],
    },
    umwPresident: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "UMW President is required"],
    },
    ummPresident: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "UMM President is required"],
    },
}, {
    _id: false,
});
const nurtureSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Nurture Chairperson is required"],
    },
    worship: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Worship Chairperson is required"],
    },
    assistant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Nurture Assistant is required"],
    },
    sundaySchool: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Sunday School Superintendent is required"],
    },
    christianEducation: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "CE Chairperson is required"],
    },
    stewardship: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Stewardship Chairperson is required"],
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
}, {
    _id: false,
});
const outreachSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Outreach Chairperson is required"],
    },
    viceChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Outreach Vice Chairperson is required"],
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
}, {
    _id: false,
});
const witnessSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Witness Chairperson is required"],
    },
    viceChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Witness Vice Chairperson is required"],
    },
    membershipCare: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Membership Care Chairperson is required"],
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
}, {
    _id: false,
});
const churchHistorianSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Church Historian is required"],
    },
    assistant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Church History Assistant is required"],
    },
}, {
    _id: false,
});
const communicationsSchema = new mongoose_1.Schema({
    chairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Communications Chairperson is required"],
    },
    assistant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Communications Assistant is required"],
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
}, {
    _id: false,
});
const financeSchema = new mongoose_1.Schema({
    financeChairperson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Finance Chairperson is required"],
    },
    treasurer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Treasurer is required"],
    },
    auditor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Auditor is required"],
    },
    financeSecretary: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Membership",
        required: [true, "Finance Secretary is required"],
    },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
}, {
    _id: false,
});
const councilSchema = new mongoose_1.Schema({
    startYear: { type: Date, required: true },
    endYear: { type: Date, required: true },
    localChurch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Local",
        required: [true, "Local Church is required"],
        index: true,
    },
    administrativeOffice: {
        type: administrativeOfficeSchema,
        required: [true, "Administrative Office is required"],
    },
    nurture: {
        type: nurtureSchema,
        required: [true, "Nurture is required"],
    },
    outreach: {
        type: outreachSchema,
        required: [true, "Outreach is required"],
    },
    witness: {
        type: witnessSchema,
        required: [true, "Witness is required"],
    },
    churchHistorian: {
        type: churchHistorianSchema,
        required: [true, "Church Historian is required"],
    },
    communications: {
        type: communicationsSchema,
        required: [true, "Communications is required"],
    },
    finance: {
        type: financeSchema,
        required: [true, "Finance is required"],
    },
    customId: { type: String, unique: true },
}, { timestamps: true });
// [MIDDLEWARE]
councilSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "Council",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
councilSchema.post("findOneAndUpdate", async function (doc) {
    await Logs_1.default.create({
        action: "updated",
        collection: "Council",
        documentId: doc._id,
        newData: doc.toObject(),
        timestamp: new Date(),
    });
});
councilSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Council",
            documentId: doc._id,
            data: doc.toObject(),
            timestamp: new Date(),
        });
    }
});
// [EXPORT]
const Council = (0, mongoose_1.model)("Council", councilSchema);
exports.default = Council;
//# sourceMappingURL=Council.js.map