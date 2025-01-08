"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDistrict = exports.updateDistrict = exports.getDistrictById = exports.createDistrict = exports.getAllDistrict = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const District_1 = __importDefault(require("../models/District"));
const Annual_1 = __importDefault(require("../models/Annual"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Gets all district
const getAllDistrict = async (req, res) => {
    var _a, _b;
    try {
        const { episcopalArea, search, page = 1, limit = 10 } = req.query;
        // Convert pagination params to numbers
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        // Define the aggregation pipeline
        const pipeline = [
            {
                $lookup: {
                    from: "annuals",
                    localField: "annualConference",
                    foreignField: "_id",
                    as: "annualConference",
                },
            },
            {
                $unwind: "$annualConference",
            },
            {
                $project: {
                    name: 1,
                    customId: 1,
                    "annualConference._id": 1,
                    "annualConference.name": 1,
                    "annualConference.episcopalArea": 1,
                },
            },
        ];
        // Restrict data based on user role
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "annual") {
            pipeline.push({
                $match: {
                    "annualConference._id": req.user.annual,
                },
            });
        }
        // Add episcopalArea filter if provided
        if (episcopalArea) {
            pipeline.push({
                $match: {
                    "annualConference.episcopalArea": episcopalArea,
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
        // Add sorting
        pipeline.push({
            $sort: { name: 1 },
        });
        // Add pagination
        pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });
        // Execute the aggregation pipeline
        const districts = await District_1.default.aggregate(pipeline);
        // Get total count for pagination metadata
        const totalCountPipeline = pipeline.filter((stage) => !("$skip" in stage || "$limit" in stage));
        const totalCount = await District_1.default.aggregate([
            ...totalCountPipeline,
            { $count: "total" },
        ]);
        const count = ((_b = totalCount[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
        res.status(200).json({
            success: true,
            data: districts,
            meta: {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum),
            },
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all district conferences");
    }
};
exports.getAllDistrict = getAllDistrict;
// Create a new district
const createDistrict = async (req, res) => {
    const { name, annualConference } = req.body;
    try {
        // Manually check if district conference already exists
        const existingDistrictConference = await District_1.default.findOne({
            name,
            annualConference,
        });
        if (existingDistrictConference) {
            return res.status(409).json({
                success: false,
                message: "A district conference with this name and annual conference already exists.",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "districtId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `DC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        const districtConference = new District_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newDistrict = await districtConference.save();
        res.status(201).json(newDistrict);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating district conference");
    }
};
exports.createDistrict = createDistrict;
// Get a single district by ID
const getDistrictById = async (req, res) => {
    var _a, _b;
    try {
        const { id } = req.params;
        // Fetch the district with the given ID and populate annualConference fields
        const district = await District_1.default.findById(id).populate("annualConference", "name episcopalArea");
        // Check if the district exists
        if (!district) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }
        // Role-based restriction: Check if the user is authorized to access this district
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "annual" &&
            district.annualConference._id.toString() !== ((_b = req.user.annual) === null || _b === void 0 ? void 0 : _b.toString())) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You are not authorized to access this district",
            });
        }
        res.status(200).json({
            success: true,
            data: district,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting district conference");
    }
};
exports.getDistrictById = getDistrictById;
// Update district by ID
const updateDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, annualConference } = req.body;
        // Check if the district with the provided ID exists
        const existingDistrict = await District_1.default.findById(id);
        if (!existingDistrict) {
            return res.status(404).json({
                success: false,
                message: "District not found with the provided ID.",
            });
        }
        // Check if there's another district conference with same name and annual conference
        const existingDistrictConference = await District_1.default.findOne({
            name,
            annualConference,
            _id: { $ne: id },
        });
        if (existingDistrictConference) {
            return res.status(409).json({
                success: false,
                message: "A district conference with this name and annual conference already exists.",
            });
        }
        if (annualConference) {
            const annualConferenceCheck = await Annual_1.default.findById(annualConference);
            if (!annualConferenceCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid Annual Conference reference" });
            }
        }
        const updateDistrict = await District_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateDistrict) {
            return res.status(404).json({ message: "Membership not found" });
        }
        res.status(200).json(updateDistrict);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating district conference");
    }
};
exports.updateDistrict = updateDistrict;
// Delete a district
const deleteDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the district with the provided ID exists
        const existingDistrict = await District_1.default.findById(id);
        if (!existingDistrict) {
            return res.status(404).json({
                success: false,
                message: "District not found with the provided ID.",
            });
        }
        const deleteDistrict = await District_1.default.findByIdAndDelete(id);
        if (!deleteDistrict) {
            return res
                .status(404)
                .json({ success: false, message: "District not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "District deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting district conference");
    }
};
exports.deleteDistrict = deleteDistrict;
//# sourceMappingURL=districtController.js.map