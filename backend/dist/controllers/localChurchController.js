"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnniversariesByMonth = exports.deleteLocalChurch = exports.updateLocalChurch = exports.getLocalChurchById = exports.createLocalChurch = exports.getAllLocalChurch = void 0;
const mongoose_1 = require("mongoose");
// Local import
const handleError_1 = require("../utils/handleError");
const Local_1 = __importDefault(require("../models/Local"));
const District_1 = __importDefault(require("../models/District"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Get all local church
const getAllLocalChurch = async (req, res) => {
    var _a, _b, _c;
    try {
        const { episcopalArea, annualConference, district, search, month, page = 1, limit = 10, } = req.query;
        // Convert pagination params to numbers
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        // Ensure month is a string before validation
        const monthStr = typeof month === "string" ? month : undefined;
        // Validate month parameter
        if (monthStr &&
            (!/^\d{2}$/.test(monthStr) ||
                parseInt(monthStr) < 1 ||
                parseInt(monthStr) > 12)) {
            return res.status(400).json({
                success: false,
                message: "Invalid month format. Please provide a two-digit month between '01' and '12'.",
            });
        }
        // Define the aggregation pipeline
        const pipeline = [
            {
                $lookup: {
                    from: "districts",
                    localField: "district",
                    foreignField: "_id",
                    as: "district",
                },
            },
            {
                $unwind: "$district",
            },
            {
                $lookup: {
                    from: "annuals",
                    localField: "district.annualConference",
                    foreignField: "_id",
                    as: "district.annualConference",
                },
            },
            {
                $unwind: "$district.annualConference",
            },
            {
                $project: {
                    name: 1,
                    customId: 1,
                    "district._id": 1,
                    "district.name": 1,
                    "district.annualConference._id": 1,
                    "district.annualConference.name": 1,
                    "district.annualConference.episcopalArea": 1,
                    anniversaryDate: 1,
                },
            },
        ];
        // Restrict data based on user role
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "annual") {
            pipeline.push({
                $match: {
                    "district.annualConference._id": req.user.annual,
                },
            });
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "district") {
            pipeline.push({
                $match: {
                    "district._id": req.user.district,
                },
            });
        }
        // Add episcopalArea filter if provided
        if (episcopalArea) {
            pipeline.push({
                $match: {
                    "district.annualConference.episcopalArea": episcopalArea,
                },
            });
        }
        // Add annualConference filter if provided
        if (annualConference) {
            pipeline.push({
                $match: {
                    "district.annualConference._id": new mongoose_1.Types.ObjectId(annualConference),
                },
            });
        }
        // Add district filter if provided
        if (district) {
            pipeline.push({
                $match: {
                    "district._id": new mongoose_1.Types.ObjectId(district),
                },
            });
        }
        // Add search filter if provided
        if (search) {
            pipeline.push({
                $match: {
                    name: { $regex: search, $options: "i" },
                },
            });
        }
        // Add month filter if provided
        if (monthStr) {
            const monthInt = parseInt(monthStr, 10);
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$anniversaryDate" }, monthInt],
                    },
                },
            });
        }
        // Add sorting
        pipeline.push({
            $sort: { name: 1 },
        });
        // Add pagination
        pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });
        // Execute the aggregation pipeline
        const localChurches = await Local_1.default.aggregate(pipeline);
        // Get total count for pagination metadata
        const totalCountPipeline = pipeline.filter((stage) => !("$skip" in stage || "$limit" in stage));
        const totalCount = await Local_1.default.aggregate([
            ...totalCountPipeline,
            { $count: "total" },
        ]);
        const count = ((_c = totalCount[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
        res.status(200).json({
            success: true,
            data: localChurches,
            meta: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum),
            },
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all local churches");
    }
};
exports.getAllLocalChurch = getAllLocalChurch;
// Create a new local church
const createLocalChurch = async (req, res) => {
    const { name, district } = req.body;
    try {
        // Manually check if the local church already exists
        const existingLocalChurch = await Local_1.default.findOne({
            name,
            district,
        });
        if (existingLocalChurch) {
            return res.status(409).json({
                success: false,
                message: "A local church with this name, district, and annual conference already exists.",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "localId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `LC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // If it doesn't exist, create a new one
        const localChurch = new Local_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newLocalChurch = await localChurch.save();
        res.status(201).json(newLocalChurch);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating local church");
    }
};
exports.createLocalChurch = createLocalChurch;
// Get a single local church by ID
const getLocalChurchById = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { id } = req.params;
        // Fetch the localChurch with populated district and annualConference fields
        const localChurch = await Local_1.default.findById(id).populate({
            path: "district",
            select: "_id name annualConference",
            populate: {
                path: "annualConference",
                select: "_id name episcopalArea",
            },
        });
        // Check if the localChurch exists
        if (!localChurch) {
            return res.status(404).json({
                success: false,
                message: "Local Church not found",
            });
        }
        // Extract district for cleaner access
        const district = localChurch.district;
        // Role-based restriction: Check if the user is authorized to access this localChurch
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "annual" &&
            district.annualConference._id.toString() !== ((_b = req.user.annual) === null || _b === void 0 ? void 0 : _b.toString())) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You are not authorized to access this local church",
            });
        }
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === "district" &&
            district._id.toString() !== ((_d = req.user.district) === null || _d === void 0 ? void 0 : _d.toString())) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You are not authorized to access this local church",
            });
        }
        // Send the response with the local church data
        res.status(200).json({ success: true, data: localChurch });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting local church");
    }
};
exports.getLocalChurchById = getLocalChurchById;
// Update local church by ID
const updateLocalChurch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, district, annualConference } = req.body;
        // Check if there's another local church with same name, district, and annual conference
        const existingLocalChurch = await Local_1.default.findOne({
            name,
            district,
            annualConference,
            _id: { $ne: id },
        });
        if (existingLocalChurch) {
            return res.status(409).json({
                success: false,
                message: "A local church with this name and district already exists.",
            });
        }
        if (!existingLocalChurch) {
            return res.status(404).json({
                success: false,
                message: "Local Church not found with the provided ID.",
            });
        }
        if (district) {
            const districtCheck = await District_1.default.findById(district);
            if (!districtCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid District Conference " });
            }
        }
        const updateLocal = await Local_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateLocal) {
            return res.status(404).json({ message: "Local Church not found" });
        }
        res.status(200).json(updateLocal);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating local church");
    }
};
exports.updateLocalChurch = updateLocalChurch;
// Delete a Local church
const deleteLocalChurch = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteLocal = await Local_1.default.findByIdAndDelete(id);
        if (!deleteLocal) {
            return res
                .status(404)
                .json({ success: false, message: "Local not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Local Church deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting local church");
    }
};
exports.deleteLocalChurch = deleteLocalChurch;
// Get local church by anniversary month
const getAnniversariesByMonth = async (req, res) => {
    try {
        const { month } = req.query;
        // Ensure month is a valid string and between 01 and 12
        const monthStr = typeof month === "string" ? month : undefined;
        if (!monthStr ||
            !/^\d{2}$/.test(monthStr) ||
            parseInt(monthStr, 10) < 1 ||
            parseInt(monthStr, 10) > 12) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid two-digit month between '01' and '12'.",
            });
        }
        const monthInt = parseInt(monthStr, 10);
        // Build the aggregation pipeline
        const pipeline = [
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$anniversaryDate" }, monthInt],
                    },
                },
            },
            {
                $lookup: {
                    from: "districts",
                    localField: "district",
                    foreignField: "_id",
                    as: "district",
                },
            },
            {
                $unwind: "$district",
            },
            {
                $project: {
                    name: 1,
                    customId: 1,
                    address: 1,
                    district: {
                        _id: 1,
                        name: 1,
                    },
                    contactNo: 1,
                    anniversaryDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: { name: 1 },
            },
        ];
        // Fetch local churches with anniversary in the specified month
        const localChurches = await Local_1.default.aggregate(pipeline);
        res.status(200).json({
            success: true,
            data: localChurches,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while fetching local churches with anniversaries.");
    }
};
exports.getAnniversariesByMonth = getAnniversariesByMonth;
//# sourceMappingURL=localChurchController.js.map