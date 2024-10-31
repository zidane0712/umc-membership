"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembersFromMinistry = exports.addMemberToMinistry = exports.deleteMinistry = exports.updateMinistry = exports.getMinistryById = exports.createMinistry = exports.getAllMinistry = void 0;
// Local import
const Local_1 = __importDefault(require("../models/Local"));
const Membership_1 = __importDefault(require("../models/Membership"));
const Ministries_1 = __importDefault(require("../models/Ministries"));
const handleError_1 = require("../utils/handleError");
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Gets all ministries
const getAllMinistry = async (req, res) => {
    try {
        // Extract query parameters from the request
        const { name, localChurch } = req.query;
        // Create a filter object to hold the query conditions
        const filter = {};
        // If 'name' is provided, use a case-insensitive regular expression for searching
        if (name) {
            filter.name = { $regex: new RegExp(name, "i") };
        }
        // If 'localChurch' is provided, add it to the filter
        if (localChurch) {
            filter.localChurch = localChurch;
        }
        // Find ministries based on the filter and populate related fields
        const ministries = await Ministries_1.default.find(filter)
            .populate("localChurch", "name")
            .populate("members", "name");
        res.status(200).json({ success: true, data: ministries });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all ministries");
    }
};
exports.getAllMinistry = getAllMinistry;
// Create a new ministry
const createMinistry = async (req, res) => {
    const { name, localChurch } = req.body;
    try {
        // Manually check if ministry exists in the local church
        const existingMinistry = await Ministries_1.default.findOne({
            name,
            localChurch,
        });
        if (existingMinistry) {
            return res.status(409).json({
                success: false,
                message: "A ministry with this name in the local church already exists.",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "ministryId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom id
        const customId = `MLC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // If it doesn't exist, create a new one
        const ministry = new Ministries_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newMinistry = await ministry.save();
        res.status(201).json(newMinistry);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating ministry");
    }
};
exports.createMinistry = createMinistry;
// Get a single ministry by ID
const getMinistryById = async (req, res) => {
    try {
        const { id } = req.params;
        const ministry = await Ministries_1.default.findById(id)
            .populate("localChurch", "name")
            .populate("members", "name");
        if (!ministry) {
            return res
                .status(404)
                .json({ success: false, message: "Ministry not found" });
        }
        res.status(200).json({ success: true, data: ministry });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting ministry");
    }
};
exports.getMinistryById = getMinistryById;
// Update a ministry by ID
const updateMinistry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, localChurch } = req.body;
        const existingMinistry = await Ministries_1.default.findOne({
            name,
            localChurch,
            _id: { $ne: id },
        });
        if (existingMinistry) {
            return res.status(409).json({
                success: false,
                message: "A ministry with this name in the local church already exists",
            });
        }
        if (!existingMinistry) {
            return res.status(404).json({
                success: false,
                message: "Ministry not found with provided id",
            });
        }
        if (localChurch) {
            const localChurchCheck = await Local_1.default.findById(localChurch);
            if (!localChurchCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid Local Church reference." });
            }
        }
        const updateMinistry = await Ministries_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateMinistry) {
            return res.status(404).json({ message: "Ministry not found" });
        }
        res.status(200).json(updateMinistry);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating ministry");
    }
};
exports.updateMinistry = updateMinistry;
// Delete a ministry
const deleteMinistry = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteMinistry = await Ministries_1.default.findByIdAndDelete(id);
        if (!deleteMinistry) {
            return res
                .status(404)
                .json({ success: false, message: "Ministry not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Ministry deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting ministry");
    }
};
exports.deleteMinistry = deleteMinistry;
// Add multiple members to a ministry
const addMemberToMinistry = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberIds } = req.body;
        // Find the ministry by Id and initialize the members array if undefined
        const ministry = await Ministries_1.default.findById(id);
        if (!ministry) {
            return res.status(404).json({ message: "Ministry not found" });
        }
        ministry.members = ministry.members || [];
        // Find the members by Ids
        const members = await Membership_1.default.find({ _id: { $in: memberIds } });
        if (members.length !== memberIds.length) {
            return res.status(404).json({ message: "One or more members not found" });
        }
        // Ensure members belong to the same local church as the ministry
        for (const member of members) {
            if (!member.localChurch.equals(ministry.localChurch)) {
                return res.status(400).json({
                    message: "All members and the Ministry must belong to the same local church",
                });
            }
        }
        // Filter out the members that are already in the ministry
        const newMemberIds = memberIds.filter((memberId) => !ministry.members.includes(memberId));
        // Update the Ministry using findOneAndUpdate
        if (newMemberIds.length > 0) {
            await Ministries_1.default.findOneAndUpdate({ _id: id }, { $addToSet: { members: { $each: newMemberIds } } }, { new: true } // Return the updated document
            );
        }
        // Update each member to add the ministry if not already present
        const updates = members.map(async (member) => {
            await Membership_1.default.findOneAndUpdate({ _id: member._id }, { $addToSet: { ministries: ministry._id } }, { new: true } // Return the updated document
            );
        });
        await Promise.all(updates);
        res.status(200).json({
            success: true,
            message: "Members successfully added to Ministry",
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while adding members to the ministry");
    }
};
exports.addMemberToMinistry = addMemberToMinistry;
// Remove members from a ministry
const removeMembersFromMinistry = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberIds } = req.body;
        // Find the ministry by Id and initialize the members array if undefined
        const ministry = await Ministries_1.default.findById(id);
        if (!ministry) {
            return res.status(404).json({ message: "Ministry not found" });
        }
        ministry.members = ministry.members || []; // Ensure members array is initialized
        // Filter for valid memberIds that are currently in the ministry
        const membersToRemove = memberIds.filter((memberId) => ministry.members.includes(memberId));
        if (membersToRemove.length === 0) {
            return res
                .status(404)
                .json({ message: "No matching members found in the ministry" });
        }
        // Update the Ministry using findOneAndUpdate to remove the members
        await Ministries_1.default.findOneAndUpdate({ _id: id }, { $pull: { members: { $in: membersToRemove } } }, { new: true } // Return the updated document
        );
        // Update each member to remove the ministry reference
        const updates = membersToRemove.map(async (memberId) => {
            await Membership_1.default.findOneAndUpdate({ _id: memberId }, { $pull: { ministries: ministry._id } }, { new: true } // Return the updated document
            );
        });
        await Promise.all(updates);
        res.status(200).json({
            success: true,
            message: "Members successfully removed from Ministry",
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while removing members from the ministry");
    }
};
exports.removeMembersFromMinistry = removeMembersFromMinistry;
//# sourceMappingURL=ministriesController.js.map