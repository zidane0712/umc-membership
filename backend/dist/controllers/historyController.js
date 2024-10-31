"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHistory = exports.updateHistory = exports.getHistoryById = exports.createHistory = exports.getAllHistory = void 0;
const mongoose_1 = require("mongoose");
// Local import
const handleError_1 = require("../utils/handleError");
const History_1 = __importDefault(require("../models/History"));
const Counter_1 = __importDefault(require("../models/Counter"));
const Membership_1 = __importDefault(require("../models/Membership"));
// [CONTROLLERS]
// Get all history
const getAllHistory = async (req, res) => {
    try {
        const { historian, title, startDate, endDate, tags } = req.query;
        const pipeline = [
            {
                $lookup: {
                    from: "memberships",
                    localField: "historian",
                    foreignField: "_id",
                    as: "historian",
                },
            },
            {
                $unwind: "$historian",
            },
            {
                $project: {
                    title: 1,
                    date: 1,
                    content: 1,
                    tags: 1,
                    mediaLink: 1,
                    customId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    historian: {
                        _id: "$historian._id",
                        name: {
                            firstname: "$historian.name.firstname",
                            middlename: "$historian.name.middlename",
                            lastname: "$historian.name.lastname",
                        },
                    },
                },
            },
        ];
        // Apply filters based on query parameters
        if (historian) {
            pipeline.unshift({
                $match: { historian: new mongoose_1.Types.ObjectId(historian) },
            });
        }
        if (title) {
            pipeline.push({
                $match: {
                    title: { $regex: new RegExp(title, "i") },
                },
            });
        }
        if (startDate && endDate) {
            pipeline.push({
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            });
        }
        else if (startDate) {
            pipeline.push({
                $match: {
                    date: {
                        $gte: new Date(startDate),
                    },
                },
            });
        }
        else if (endDate) {
            pipeline.push({
                $match: {
                    date: {
                        $lte: new Date(endDate),
                    },
                },
            });
        }
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : [tags];
            pipeline.push({
                $match: { tags: { $in: tagsArray } },
            });
        }
        const histories = await History_1.default.aggregate(pipeline);
        res.status(200).json({ success: true, data: histories });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all histories");
    }
};
exports.getAllHistory = getAllHistory;
// Create new history
const createHistory = async (req, res) => {
    const { date, historian, localChurch, title, content, tags, mediaLink } = req.body;
    try {
        // Check if date is in the future
        if (date && new Date(date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Date must not be greater than the current date",
            });
        }
        // Check if a history exists with the same date and local church
        const existingHistory = await History_1.default.findOne({
            date,
            title,
            localChurch,
        });
        if (existingHistory) {
            return res.status(409).json({
                success: false,
                message: "History already exists in this local church with the same date",
            });
        }
        // Find historian Id if exists
        const historianCheck = await Membership_1.default.findById(historian);
        if (!historianCheck) {
            return res.status(404).json({ message: "Historian not found" });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "historyId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `HLC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // Create a new History
        const history = new History_1.default({
            date,
            title,
            content,
            historian,
            tags,
            mediaLink,
            localChurch,
            customId,
        });
        // Save history and response
        const newHistory = await history.save();
        res.status(201).json({
            success: true,
            data: newHistory,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating the history");
    }
};
exports.createHistory = createHistory;
// Get history by id
const getHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await History_1.default.findById(id)
            .populate("localChurch", "name")
            .populate("historian", "name");
        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }
        res.status(200).json({ success: true, data: history });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting history");
    }
};
exports.getHistoryById = getHistoryById;
// Update history by id
const updateHistory = async (req, res) => {
    const { id } = req.params;
    const { date, historian, title, content, tags, localChurch, mediaLink } = req.body;
    try {
        // Check if the history exists with the provided Id
        const existingHistoryById = await History_1.default.findById(id);
        if (!existingHistoryById) {
            return res.status(404).json({
                success: false,
                message: "History not found with the provided ID.",
            });
        }
        if (date && new Date(date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Date must not be greater than the current date",
            });
        }
        // Check if the historian exists in Membership and belongs to the specified localChurch
        const historianCheck = await Membership_1.default.findOne({
            _id: historian,
            localChurch,
        });
        if (!historianCheck) {
            return res.status(404).json({
                success: false,
                message: "Historian not found in the specified local church.",
            });
        }
        // Check for existing history in the same local church with the same name and date
        const existingHistory = await History_1.default.findOne({
            _id: { $ne: id },
            title,
            localChurch,
            date,
        });
        if (existingHistory) {
            return res.status(409).json({
                success: false,
                message: "A history with the same name and date already exists in this local church",
            });
        }
        // Update the history document
        const updatedHistory = await History_1.default.findByIdAndUpdate(id, { date, historian, localChurch, title, content, tags, mediaLink }, { new: true });
        if (!updatedHistory) {
            return res
                .status(404)
                .json({ success: false, message: "History not found" });
        }
        res.status(200).json({
            success: true,
            data: updatedHistory,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating the history");
    }
};
exports.updateHistory = updateHistory;
// Delete history
const deleteHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteHistory = await History_1.default.findByIdAndDelete(id);
        if (!deleteHistory) {
            return res
                .status(404)
                .json({ success: false, message: "History not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "History delete successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting history");
    }
};
exports.deleteHistory = deleteHistory;
//# sourceMappingURL=historyController.js.map