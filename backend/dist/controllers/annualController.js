"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnual = exports.updateAnnual = exports.getAnnualById = exports.createAnnual = exports.getAllAnnual = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const Annual_1 = __importDefault(require("../models/Annual"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Gets all annual conferences
const getAllAnnual = async (req, res) => {
    try {
        const { episcopalArea, search } = req.query;
        // Define a filter object, initially empty
        const filter = {};
        // If episcopalArea is provided, add it to the filter
        if (episcopalArea) {
            filter.episcopalArea = episcopalArea;
        }
        // If search is provided, perform a case-insensitive search on specific fields
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: "i" } }];
        }
        // Fetch the annual conferences based on the filter
        const annualConferences = await Annual_1.default.find(filter);
        res.status(200).json({ success: true, data: annualConferences });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all annual conferences");
    }
};
exports.getAllAnnual = getAllAnnual;
// Add a new annual conference
const createAnnual = async (req, res) => {
    const { name, episcopalArea } = req.body;
    try {
        // Manually check if the annual conference already exists
        const existingAnnualConference = await Annual_1.default.findOne({
            name,
            episcopalArea,
        });
        if (existingAnnualConference) {
            return res.status(409).json({
                success: false,
                message: "An annual conference with this name and episcopal area already exists",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "annualId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `AC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        const annualConference = new Annual_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newAnnualConference = await annualConference.save();
        res.status(201).json(newAnnualConference);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating annual conference");
    }
};
exports.createAnnual = createAnnual;
// Get a single annual conference by ID
const getAnnualById = async (req, res) => {
    try {
        const { id } = req.params;
        const annual = await Annual_1.default.findById(id);
        if (!annual) {
            return res
                .status(404)
                .json({ success: false, message: "Annual not found" });
        }
        res.status(200).json({ success: true, data: annual });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting annual conference");
    }
};
exports.getAnnualById = getAnnualById;
// Update an annual conference by ID
const updateAnnual = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, episcopalArea } = req.body;
        // Check if there's another annual conference with the same name and episcopal area
        const existingAnnualConference = await Annual_1.default.findOne({
            name,
            episcopalArea,
            _id: { $ne: id },
        });
        if (existingAnnualConference) {
            return res.status(409).json({
                success: false,
                message: "An annual conference with this name and episcopal area already exists.",
            });
        }
        if (!existingAnnualConference) {
            return res.status(404).json({
                success: false,
                message: "Annual Conference not found with the provided ID.",
            });
        }
        const updateAnnual = await Annual_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateAnnual) {
            return res
                .status(404)
                .json({ success: false, message: "Annual Conference not found" });
        }
        res.status(200).json({ success: true, data: updateAnnual });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating annual conference");
    }
};
exports.updateAnnual = updateAnnual;
// Delete an Annual Conference by ID
const deleteAnnual = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnnual = await Annual_1.default.findByIdAndDelete(id);
        if (!deletedAnnual) {
            return res
                .status(404)
                .json({ success: false, message: "Annual Conference not found" });
        }
        res.status(200).json({
            success: true,
            message: "Annual Conference deleted successfully",
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting annual conference");
    }
};
exports.deleteAnnual = deleteAnnual;
//# sourceMappingURL=annualController.js.map