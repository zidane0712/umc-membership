"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMinistriesFromMember = exports.addMinistriesToMember = exports.deleteMember = exports.updateMember = exports.getMemberById = exports.createMembership = exports.getAllMemberships = void 0;
const mongoose_1 = require("mongoose");
// Local import
const handleError_1 = require("../utils/handleError");
const Membership_1 = __importDefault(require("../models/Membership"));
const Annual_1 = __importDefault(require("../models/Annual"));
const District_1 = __importDefault(require("../models/District"));
const Local_1 = __importDefault(require("../models/Local"));
const Ministries_1 = __importDefault(require("../models/Ministries"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Gets all membership
const getAllMemberships = async (req, res) => {
    try {
        const { gender, civilStatus, birthMonth, baptized, confirmed, membershipClassification, isActive, localChurch, district, annualConference, episcopalArea, age, organization, search, } = req.query;
        const birthMonthInt = typeof birthMonth === "string" ? parseInt(birthMonth, 10) : undefined;
        const minAge = typeof req.query.minAge === "string"
            ? parseInt(req.query.minAge, 10)
            : undefined;
        const maxAge = typeof req.query.maxAge === "string"
            ? parseInt(req.query.maxAge, 10)
            : undefined;
        const currentYear = new Date().getFullYear();
        const pipeline = [
            {
                $lookup: {
                    from: "locals",
                    localField: "localChurch",
                    foreignField: "_id",
                    as: "localChurch",
                },
            },
            {
                $unwind: "$localChurch",
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "localChurch.district",
                    foreignField: "_id",
                    as: "localChurch.district",
                },
            },
            {
                $unwind: "$localChurch.district",
            },
            {
                $lookup: {
                    from: "annuals",
                    localField: "localChurch.district.annualConference",
                    foreignField: "_id",
                    as: "localChurch.district.annualConference",
                },
            },
            {
                $unwind: "$localChurch.district.annualConference",
            },
            {
                $lookup: {
                    from: "ministries",
                    localField: "ministries",
                    foreignField: "_id",
                    as: "ministries",
                },
            },
            {
                $project: {
                    name: 1,
                    address: 1,
                    gender: 1,
                    civilStatus: 1,
                    birthday: 1,
                    contactNo: 1,
                    isBaptized: 1,
                    isConfirmed: 1,
                    birthMonth: 1,
                    baptized: 1,
                    baptism: 1,
                    confirmed: 1,
                    confirmation: 1,
                    father: 1,
                    mother: 1,
                    children: 1,
                    customId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    membershipClassification: 1,
                    isActive: 1,
                    localChurch: {
                        _id: 1,
                        name: 1,
                        district: {
                            _id: 1,
                            name: 1,
                            annualConference: {
                                _id: 1,
                                name: 1,
                                episcopalArea: 1,
                            },
                        },
                    },
                    age: 1,
                    organization: 1,
                    ministries: {
                        _id: 1,
                        name: 1,
                    },
                },
            },
        ];
        if (gender) {
            pipeline.push({ $match: { gender } });
        }
        if (civilStatus) {
            pipeline.push({ $match: { civilStatus } });
        }
        if (birthMonthInt !== undefined) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$birthday" }, birthMonthInt],
                    },
                },
            });
        }
        if (baptized !== undefined) {
            pipeline.push({
                $match: {
                    isBaptized: baptized === "true",
                },
            });
        }
        if (confirmed !== undefined) {
            pipeline.push({
                $match: {
                    isConfirmed: confirmed === "true",
                },
            });
        }
        if (membershipClassification) {
            pipeline.push({ $match: { membershipClassification } });
        }
        if (isActive !== undefined) {
            const activeStatus = isActive === "true";
            pipeline.push({ $match: { isActive: activeStatus } });
        }
        if (localChurch) {
            pipeline.push({
                $match: {
                    "localChurch._id": new mongoose_1.Types.ObjectId(localChurch),
                },
            });
        }
        if (district) {
            pipeline.push({
                $match: {
                    "localChurch.district._id": new mongoose_1.Types.ObjectId(district),
                },
            });
        }
        if (annualConference) {
            pipeline.push({
                $match: {
                    "localChurch.district.annualConference._id": new mongoose_1.Types.ObjectId(annualConference),
                },
            });
        }
        if (episcopalArea) {
            pipeline.push({
                $match: {
                    "localChurch.district.annualConference.episcopalArea": episcopalArea,
                },
            });
        }
        if (age !== undefined) {
            const parsedAge = parseInt(age, 10);
            pipeline.push({
                $match: {
                    age: parsedAge,
                },
            });
        }
        if (organization) {
            pipeline.push({ $match: { organization } });
        }
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "name.firstname": { $regex: search, $options: "i" } },
                        { "name.lastname": { $regex: search, $options: "i" } },
                        { customId: { $regex: search, $options: "i" } },
                        { "address.permanent.barangay": { $regex: search, $options: "i" } },
                        { "address.current.barangay": { $regex: search, $options: "i" } },
                    ],
                },
            });
        }
        const memberships = await Membership_1.default.aggregate(pipeline);
        res.status(200).json({ success: true, data: memberships });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all memberships");
    }
};
exports.getAllMemberships = getAllMemberships;
// Create a new membership
const createMembership = async (req, res) => {
    const { name, birthday, district, localChurch } = req.body;
    try {
        // Check if the birthday is in the future
        if (birthday && new Date(birthday) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Birthday date must not be greater than the current date.",
            });
        }
        // Check if a membership already exists with the same name, district, and local church
        const existingMembership = await Membership_1.default.findOne({
            name,
        });
        if (existingMembership) {
            return res.status(409).json({
                success: false,
                message: "Member already exists>",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "membershipId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `UMC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(5, "0")}`;
        // If it doesn't exist, create a new membership
        const membership = new Membership_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newMembership = await membership.save();
        res.status(201).json(newMembership);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating member");
    }
};
exports.createMembership = createMembership;
// Get a single membership by ID
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Membership_1.default.findById(id)
            .populate({
            path: "localChurch",
            select: "_id name district",
            populate: {
                path: "district",
                select: "_id name annualConference",
                populate: {
                    path: "annualConference",
                    select: "_id name episcopalArea",
                },
            },
        })
            .populate("ministries", "name");
        if (!member) {
            return res
                .status(404)
                .json({ success: false, message: "Member not found" });
        }
        res.status(200).json({ success: true, data: member });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting member by id");
    }
};
exports.getMemberById = getMemberById;
// Update a member by ID
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, localChurch, district, annualConference, baptism, confirmation, } = req.body;
        // Check if there's another membership with same name, district, and annual conference
        const existingMembership = await Membership_1.default.findOne({
            name,
            localChurch,
            district,
            annualConference,
            _id: { $ne: id },
        });
        if (existingMembership) {
            return res.status(409).json({
                success: false,
                message: "A membership with this name, localChurch, district, and annual conference already exists.",
            });
        }
        if (!existingMembership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found with the provided ID.",
            });
        }
        if (annualConference) {
            const annualConferenceCheck = await Annual_1.default.findById(annualConference);
            if (!annualConferenceCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid Annual Conference reference." });
            }
        }
        if (district) {
            const districtCheck = await District_1.default.findById(district);
            if (!districtCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid District Conference reference." });
            }
        }
        if (localChurch) {
            const localChurchCheck = await Local_1.default.findById(localChurch);
            if (!localChurchCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid Local Church reference." });
            }
        }
        // Automatically set isBaptized to true if baptism info is provided
        if (baptism && (baptism.year || baptism.officiatingMinister)) {
            req.body.isBaptized = true;
        }
        else {
            req.body.isBaptized = false;
        }
        // Automatically set isConfirmed to true if confirmation info is provided
        if (confirmation &&
            (confirmation.year || confirmation.officiatingMinister)) {
            req.body.isConfirmed = true;
        }
        else {
            req.body.isConfirmed = false;
        }
        const updateMembership = await Membership_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateMembership) {
            return res.status(404).json({ message: "Membership not found" });
        }
        res.status(200).json(updateMembership);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating member");
    }
};
exports.updateMember = updateMember;
// Delete a member
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMember = await Membership_1.default.findByIdAndDelete(id);
        if (!deletedMember) {
            return res
                .status(404)
                .json({ success: false, message: "Member not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Member deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting member");
    }
};
exports.deleteMember = deleteMember;
// Add multiple ministries to a member
const addMinistriesToMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { ministryIds } = req.body;
        // Find the member by ID
        const member = await Membership_1.default.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // Initialize ministries array if undefined
        const updatedMinistries = member.ministries || [];
        // Find the ministries by IDs
        const ministries = await Ministries_1.default.find({ _id: { $in: ministryIds } });
        if (ministries.length !== ministryIds.length) {
            return res
                .status(404)
                .json({ message: "One or more ministries not found" });
        }
        // Ensure ministries belong to the same local church as the member
        for (const ministry of ministries) {
            if (!ministry.localChurch.equals(member.localChurch)) {
                return res.status(400).json({
                    message: "All ministries and the member must belong to the same local church",
                });
            }
        }
        // Add ministries to the member if not already added
        const newMinistryIds = ministryIds.filter((ministryId) => !updatedMinistries.includes(ministryId));
        if (newMinistryIds.length > 0) {
            updatedMinistries.push(...newMinistryIds);
        }
        // Use findOneAndUpdate to update the ministries
        const updatedMember = await Membership_1.default.findOneAndUpdate({ _id: id }, { $set: { ministries: updatedMinistries } }, // Update ministries
        { new: true } // Return the updated document
        );
        if (updatedMember) {
            // Add the member to each ministry if not already added
            const updates = ministries.map(async (ministry) => {
                ministry.members = ministry.members || [];
                if (!ministry.members.some((memberId) => memberId.equals(updatedMember._id))) {
                    ministry.members.push(updatedMember._id);
                    await ministry.save();
                }
            });
            await Promise.all(updates);
            res.status(200).json({
                success: true,
                message: "Ministries successfully added to member",
            });
        }
        else {
            res
                .status(404)
                .json({ message: "Failed to update ministries for member" });
        }
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while adding ministries to the member");
    }
};
exports.addMinistriesToMember = addMinistriesToMember;
// Remove multiple ministries from a member
const removeMinistriesFromMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { ministryIds } = req.body;
        // Find the member by ID
        const member = await Membership_1.default.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        // Initialize ministries array if undefined
        const updatedMinistries = member.ministries || [];
        // Filter for valid ministryIds that are currently in the member's ministries
        const ministriesToRemove = ministryIds.filter((ministryId) => updatedMinistries.includes(ministryId));
        if (ministriesToRemove.length === 0) {
            return res
                .status(404)
                .json({ message: "No matching ministries found for the member" });
        }
        // Use findOneAndUpdate to update the ministries by pulling the ones to remove
        const updatedMember = await Membership_1.default.findOneAndUpdate({ _id: id }, { $pull: { ministries: { $in: ministriesToRemove } } }, // Remove ministries
        { new: true } // Return the updated document
        );
        if (updatedMember) {
            // Remove the member from each ministry's members array
            const updates = ministriesToRemove.map(async (ministryId) => {
                const ministry = await Ministries_1.default.findById(ministryId);
                if (ministry) {
                    ministry.members = ministry.members || [];
                    if (ministry.members.some((memberId) => memberId.equals(updatedMember._id))) {
                        ministry.members = ministry.members.filter((memberId) => !memberId.equals(updatedMember._id));
                        await ministry.save();
                    }
                }
            });
            await Promise.all(updates);
            res.status(200).json({
                success: true,
                message: "Ministries successfully removed from member",
            });
        }
        else {
            res
                .status(404)
                .json({ message: "Failed to update ministries for member" });
        }
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while removing ministries from the member");
    }
};
exports.removeMinistriesFromMember = removeMinistriesFromMember;
//# sourceMappingURL=membershipController.js.map