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
// [ENUM]
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender || (Gender = {}));
var CivilStatus;
(function (CivilStatus) {
    CivilStatus["Single"] = "single";
    CivilStatus["Married"] = "married";
    CivilStatus["Separated"] = "separated";
    CivilStatus["widowed"] = "widowed";
})(CivilStatus || (CivilStatus = {}));
var MembershipClassification;
(function (MembershipClassification) {
    MembershipClassification["Baptized"] = "baptized";
    MembershipClassification["Professing"] = "professing";
    MembershipClassification["Affiliate"] = "affiliate";
    MembershipClassification["Associate"] = "associate";
    MembershipClassification["Constituent"] = "constituent";
})(MembershipClassification || (MembershipClassification = {}));
var Organization;
(function (Organization) {
    Organization["UMM"] = "umm";
    Organization["UMWSCS"] = "umwscs";
    Organization["UMYAF"] = "umyaf";
    Organization["UMYF"] = "umyf";
    Organization["UMCF"] = "umcf";
})(Organization || (Organization = {}));
// [SCHEMA]
const membershipSchema = new mongoose_1.Schema({
    name: {
        firstname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        middlename: {
            type: String,
            trim: true,
        },
        lastname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        suffix: {
            type: String,
            trim: true,
        },
    },
    address: {
        permanent: {
            type: commonSchemas_1.addressSchema,
            required: [true, "Permanent address is required"],
        },
        current: {
            type: commonSchemas_1.addressSchema,
            required: [true, "Current address is required"],
        },
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Gender is required"],
        index: true,
    },
    civilStatus: {
        type: String,
        enum: ["single", "married", "separated", "widowed"],
        required: [true, "Civil status is required"],
        index: true,
    },
    birthday: {
        type: Date,
        required: [true, "Birth date is required"],
        index: true,
    },
    age: {
        type: Number,
        index: true,
    },
    contactNo: {
        type: String,
        required: [true, "Contact number is required"],
        validate: {
            validator: function (v) {
                return /^09\d{9}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid cellphone number`,
        },
    },
    isBaptized: { type: Boolean, default: false, index: true },
    baptism: {
        type: commonSchemas_1.baptismConfirmationSchema,
    },
    isConfirmed: { type: Boolean, default: false, index: true },
    confirmation: {
        type: commonSchemas_1.baptismConfirmationSchema,
    },
    father: {
        type: commonSchemas_1.familySchema,
    },
    mother: {
        type: commonSchemas_1.familySchema,
    },
    spouse: {
        type: commonSchemas_1.familySchema,
    },
    children: {
        type: [commonSchemas_1.familySchema],
    },
    membershipClassification: {
        type: String,
        enum: ["baptized", "professing", "affiliate", "associate", "constituent"],
        required: [true, "Membership classification is required"],
        index: true,
    },
    isActive: {
        type: Boolean,
        default: false,
        index: true,
    },
    organization: {
        type: String,
        enum: ["umm", "umwscs", "umyaf", "umyf", "umcf"],
        index: true,
    },
    ministries: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ministry",
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
// [PRE-SAVE MIDDLEWARE]
membershipSchema.pre("save", async function (next) {
    // Age
    const today = new Date();
    const birthDate = new Date(this.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    this.age = age;
    // Organization
    if (this.age > 40) {
        this.organization =
            this.gender === "male" ? Organization.UMM : Organization.UMWSCS;
    }
    else if (this.age <= 40 && this.age > 24) {
        this.organization = Organization.UMYAF;
    }
    else if (this.age <= 24 && this.age > 12) {
        this.organization = Organization.UMYF;
    }
    else if (this.age <= 12) {
        this.organization = Organization.UMCF;
    }
    // Check for baptism and confirmation
    if (this.baptism && (this.baptism.year || this.baptism.minister)) {
        this.isBaptized = true;
    }
    else {
        this.isBaptized = false;
    }
    if (this.confirmation &&
        (this.confirmation.year || this.confirmation.minister)) {
        this.isConfirmed = true;
    }
    else {
        this.isConfirmed = false;
    }
    // Duplicate Check
    if (this.isNew || this.isModified("name")) {
        const existingMembership = await Membership.findOne({
            name: this.name,
            _id: { $ne: this._id },
        });
        if (existingMembership) {
            const error = new Error("A membership with this name already exists.");
            return next(error);
        }
    }
    next();
});
membershipSchema.post("save", async function (doc) {
    await Logs_1.default.create({
        action: "created",
        collection: "Membership",
        documentId: doc._id,
        data: doc.toObject(),
        timestamp: new Date(),
    });
});
membershipSchema.post("findOneAndUpdate", async function (doc) {
    await Logs_1.default.create({
        action: "updated",
        collection: "Membership",
        documentId: doc._id,
        newData: doc.toObject(),
        timestamp: new Date(),
    });
});
membershipSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Logs_1.default.create({
            action: "deleted",
            collection: "Membership",
            documentId: doc._id,
            data: doc.toObject(),
            timestamp: new Date(),
        });
    }
});
// [INDEX]
// Single use indexes
membershipSchema.index({ gender: 1 });
membershipSchema.index({ civilStatus: 1 });
membershipSchema.index({ birthday: 1 });
membershipSchema.index({ age: 1 });
membershipSchema.index({ membershipClassification: 1 });
membershipSchema.index({ isActive: 1 });
membershipSchema.index({ organization: 1 });
membershipSchema.index({ localChurch: 1 });
membershipSchema.index({ isBaptized: 1 });
membershipSchema.index({ isConfirmed: 1 });
//Composite indexes
membershipSchema.index({ name: 1, district: 1, annualConference: 1 });
// [EXPORT]
const Membership = (0, mongoose_1.model)("Membership", membershipSchema);
exports.default = Membership;
//# sourceMappingURL=Membership.js.map