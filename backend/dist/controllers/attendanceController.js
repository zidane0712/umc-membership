"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.getAttendanceById = exports.createAttendance = exports.getAllAttendance = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Get all attendance
const getAllAttendance = async (req, res) => {
    try {
        const { tags, activityName, date } = req.query;
        const pipeline = [
            {
                $match: {},
            },
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
                $project: {
                    activityName: 1,
                    date: 1,
                    description: 1,
                    totalAttendees: 1,
                    tags: 1,
                    customId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    localChurch: {
                        _id: "$localChurch._id",
                        name: "$localChurch.name",
                    },
                },
            },
        ];
        // Filter by tags if provided
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : [tags];
            pipeline[0].$match.tags = { $in: tagsArray };
        }
        // Filter by activityName if provided
        if (typeof activityName === "string") {
            pipeline[0].$match.activityName = {
                $regex: new RegExp(activityName, "i"),
            };
        }
        // Filter by date if provided
        if (typeof date === "string") {
            const parsedDate = new Date(date);
            pipeline[0].$match.date = {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
            };
        }
        // Add a $group stage to calculate the total attendees sum
        pipeline.push({
            $group: {
                _id: null,
                totalAttendeesSum: { $sum: "$totalAttendees" },
                records: { $push: "$$ROOT" },
            },
        });
        const attendanceResults = await Attendance_1.default.aggregate(pipeline);
        const totalAttendeesSum = attendanceResults.length > 0 ? attendanceResults[0].totalAttendeesSum : 0;
        res.status(200).json({
            success: true,
            totalAttendeesSum,
            data: attendanceResults.length > 0 ? attendanceResults[0].records : [],
            count: attendanceResults.length > 0 ? attendanceResults[0].records.length : 0,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting attendance.");
    }
};
exports.getAllAttendance = getAllAttendance;
// Create new attendance
const createAttendance = async (req, res) => {
    const { date, activityName, description, localChurch, totalAttendees, tags } = req.body;
    try {
        // Check if date is in the future
        if (date && new Date(date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Date must not be greater than the current date",
            });
        }
        // Check if an activity exists with the same date and local church
        const existingActivity = await Attendance_1.default.findOne({
            date,
            activityName,
            localChurch,
        });
        if (existingActivity) {
            return res.status(409).json({
                success: false,
                message: "Activity already exists in this local church with the same date",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "attendanceId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `ALC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // Create a new Attendace
        const attendance = new Attendance_1.default({
            date,
            activityName,
            description,
            localChurch,
            totalAttendees,
            tags,
            customId,
        });
        // Save the attendance and respond
        const newAttendance = await attendance.save();
        res.status(201).json({
            success: true,
            data: newAttendance,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating the attendance");
    }
};
exports.createAttendance = createAttendance;
// Get attendance by id
const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance_1.default.findById(id).populate("localChurch", "name");
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json({ success: true, data: attendance });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting attendance");
    }
};
exports.getAttendanceById = getAttendanceById;
// Update an attendance by id
const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { date, activityName, description, localChurch, totalAttendees, tags } = req.body;
    try {
        // Check if the attendance with the provide id exists
        const existingAttendanceById = await Attendance_1.default.findById(id);
        if (!existingAttendanceById) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found with the provided id.",
            });
        }
        // Check if the date is in the future
        if (date && new Date(date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Activity date must not be greater than the current date.",
            });
        }
        // Check for existing attendance in the same local church with the same name and date.
        const existingAttendance = await Attendance_1.default.findOne({
            _id: { $ne: id },
            activityName,
            localChurch,
            date,
        });
        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: "An attendance with the same name and date already exists in this local church.",
            });
        }
        // Update the attendance document
        const updatedAttendance = await Attendance_1.default.findByIdAndUpdate(id, { date, activityName, description, localChurch, totalAttendees, tags }, { new: true });
        if (!updatedAttendance) {
            return res
                .status(404)
                .json({ success: false, message: "Attendance not found" });
        }
        res.status(200).json({
            success: true,
            data: updatedAttendance,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating attendance");
    }
};
exports.updateAttendance = updateAttendance;
// Delete attendance
const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteAttendance = await Attendance_1.default.findByIdAndDelete(id);
        if (!deleteAttendance) {
            return res
                .status(404)
                .json({ success: false, message: "Attendance not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Attendance deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting attendace");
    }
};
exports.deleteAttendance = deleteAttendance;
//# sourceMappingURL=attendanceController.js.map