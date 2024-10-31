"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.familySchema = exports.baptismConfirmationSchema = exports.addressSchema = void 0;
// [IMPORT]
// Mongoose import
const mongoose_1 = require("mongoose");
// [SCHEMAS]
exports.addressSchema = new mongoose_1.Schema({
    number: { type: String, trim: true },
    street: { type: String, trim: true },
    subdivision: { type: String, trim: true },
    barangay: {
        type: String,
        required: true,
        trim: true,
    },
    municipality: {
        type: String,
        required: true,
        trim: true,
    },
    province: {
        type: String,
        required: true,
        trim: true,
    },
    postalCode: {
        type: Number,
        required: true,
        trim: true,
    },
}, { _id: false });
exports.baptismConfirmationSchema = new mongoose_1.Schema({
    year: { type: Number, trim: true },
    minister: { type: String, trim: true },
}, {
    _id: false,
});
exports.familySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    isMember: { type: Boolean, default: false },
}, { _id: false });
//# sourceMappingURL=commonSchemas.js.map