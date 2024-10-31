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
    try {
        const { episcopalArea, search } = req.query;
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
                    "annualConference.name": 1,
                    "annualConference.episcopalArea": 1,
                },
            },
        ];
        // If episcopalArea is provided, add it to the match stage
        if (episcopalArea) {
            pipeline.push({
                $match: {
                    "annualConference.episcopalArea": episcopalArea,
                },
            });
        }
        // If search is provided, add it to the match stage
        if (search) {
            pipeline.push({
                $match: {
                    name: { $regex: search, $options: "i" },
                },
            });
        }
        // Perform sorting if needed
        pipeline.push({
            $sort: { name: 1 },
        });
        // Execute the aggregation pipeline
        const districts = await District_1.default.aggregate(pipeline);
        res.status(200).json({ success: true, data: districts });
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
    try {
        const { id } = req.params;
        const district = await District_1.default.findById(id).populate("annualConference", "name episcopalArea");
        if (!district) {
            return res
                .status(404)
                .json({ success: false, message: "District not found" });
        }
        res.status(200).json({ success: true, data: district });
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