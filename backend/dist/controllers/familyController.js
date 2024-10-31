"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFamily = exports.updateFamily = exports.getFamilyById = exports.createFamily = exports.getAllFamily = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const Family_1 = __importDefault(require("../models/Family"));
const Membership_1 = __importDefault(require("../models/Membership"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Get all family
const getAllFamily = async (req, res) => {
    try {
        const { anniversaryMonth, search } = req.query;
        const anniversaryMonthInt = typeof anniversaryMonth === "string"
            ? parseInt(anniversaryMonth, 10)
            : undefined;
        const pipeline = [
            {
                $lookup: {
                    from: "memberships",
                    localField: "father",
                    foreignField: "_id",
                    as: "father",
                },
            },
            {
                $unwind: {
                    path: "$father",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "memberships",
                    localField: "mother",
                    foreignField: "_id",
                    as: "mother",
                },
            },
            {
                $unwind: {
                    path: "$mother",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "memberships",
                    localField: "children",
                    foreignField: "_id",
                    as: "children",
                },
            },
            {
                $project: {
                    familyName: 1,
                    weddingDate: 1,
                    father: {
                        _id: 1,
                        "name.firstname": 1,
                        "name.lastname": 1,
                    },
                    mother: {
                        _id: 1,
                        "name.firstname": 1,
                        "name.lastname": 1,
                    },
                    children: {
                        _id: 1,
                        "name.firstname": 1,
                        "name.lastname": 1,
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];
        // Filter by anniversary month
        if (anniversaryMonthInt !== undefined) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $month: "$weddingDate" }, anniversaryMonthInt],
                    },
                },
            });
        }
        // Search by family name, father's name, mother's name, or children's name
        if (search) {
            const regexSearch = { $regex: search, $options: "i" };
            pipeline.push({
                $match: {
                    $or: [
                        { familyName: regexSearch },
                        { "father.name.firstName": regexSearch },
                        { "father.name.lastName": regexSearch },
                        { "mother.name.firstName": regexSearch },
                        { "mother.name.lastName": regexSearch },
                        { "children.name.firstName": regexSearch },
                        { "children.name.lastName": regexSearch },
                    ],
                },
            });
        }
        const families = await Family_1.default.aggregate(pipeline);
        res.status(200).json({ success: true, data: families });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all families");
    }
};
exports.getAllFamily = getAllFamily;
// Create a family
const createFamily = async (req, res) => {
    const { familyName, father, mother, weddingDate, children, localChurch } = req.body;
    try {
        // Ensure at least one of father, mother, or children is provided
        if (!father && !mother && (!children || children.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "At least one of father, mother, or children must be provided.",
            });
        }
        // Check if the weddingDate is in the future
        if (weddingDate && new Date(weddingDate) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Wedding date must not be greater than the current date.",
            });
        }
        // Check if a family already exists with the same name and local church
        const existingFamily = await Family_1.default.findOne({ familyName, localChurch });
        if (existingFamily) {
            return res.status(409).json({
                success: false,
                message: "Family already exists in this local church",
            });
        }
        // Validate father's and mother's IDs
        const memberIdsToCheck = [
            father,
            mother,
            ...(Array.isArray(children) ? children : []), // Use children directly if it's already an array
        ].filter(Boolean); // Remove any undefined values and cast to ObjectId
        // Fetch members from the database using member IDs (explicitly typing the result)
        const members = await Membership_1.default.find({ _id: { $in: memberIdsToCheck } });
        // Check if any member is missing
        if (members.length !== memberIdsToCheck.length) {
            return res.status(400).json({
                success: false,
                message: "One or more members (father, mother, or children) do not exist in the Membership collection.",
            });
        }
        // Validate father's gender if provided
        if (father) {
            const fatherMember = members.find((member) => member._id.equals(father));
            if (fatherMember && fatherMember.gender !== "male") {
                return res.status(400).json({
                    success: false,
                    message: "Father must be male.",
                });
            }
        }
        // Validate mother's gender if provided
        if (mother) {
            const motherMember = members.find((member) => member._id.equals(mother));
            if (motherMember && motherMember.gender !== "female") {
                return res.status(400).json({
                    success: false,
                    message: "Mother must be female.",
                });
            }
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "familyId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom Id
        const customId = `FLC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(5, "0")}`;
        // Create a new Family
        const family = new Family_1.default({
            familyName,
            father,
            mother,
            weddingDate,
            children,
            localChurch,
            customId,
        });
        // Save the family and respond
        const newFamily = await family.save();
        res.status(201).json({
            success: true,
            data: newFamily,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating the family");
    }
};
exports.createFamily = createFamily;
// Get family by id
const getFamilyById = async (req, res) => {
    try {
        const { id } = req.params;
        const family = await Family_1.default.findById(id)
            .populate("localChurch", "name")
            .populate("father", "name")
            .populate("mother", "name")
            .populate("children", "name");
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }
        res.status(200).json({ success: true, data: family });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting family");
    }
};
exports.getFamilyById = getFamilyById;
// Update family by id
const updateFamily = async (req, res) => {
    const { id } = req.params;
    const { familyName, father, mother, weddingDate, children, localChurch } = req.body;
    try {
        // Check if the family with the provided ID exists
        const existingFamilyById = await Family_1.default.findById(id);
        if (!existingFamilyById) {
            return res.status(404).json({
                success: false,
                message: "Family not found with the provided ID.",
            });
        }
        // Ensure at least one of father, mother, or children is provided
        if (!father && !mother && (!children || children.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "At least one of father, mother, or children must be provided.",
            });
        }
        // Check if the weddingDate is in the future
        if (weddingDate && new Date(weddingDate) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Wedding date must not be greater than the current date.",
            });
        }
        // Validate IDs for father, mother, and children
        const memberIdsToCheck = [
            father,
            mother,
            ...(Array.isArray(children) ? children : []), // Use children directly if it's an array
        ].filter(Boolean); // Remove any undefined values and cast to ObjectId
        // Fetch members from the database using member IDs
        const members = await Membership_1.default.find({
            _id: { $in: memberIdsToCheck },
        });
        // Check if any member is missing
        if (members.length !== memberIdsToCheck.length) {
            return res.status(400).json({
                success: false,
                message: "One or more members (father, mother, or children) do not exist in the Membership collection.",
            });
        }
        // Validate father's gender if provided
        if (father) {
            const fatherMember = members.find((member) => member._id.equals(father));
            if (fatherMember && fatherMember.gender !== "male") {
                return res.status(400).json({
                    success: false,
                    message: "Father must be male.",
                });
            }
        }
        // Validate mother's gender if provided
        if (mother) {
            const motherMember = members.find((member) => member._id.equals(mother));
            if (motherMember && motherMember.gender !== "female") {
                return res.status(400).json({
                    success: false,
                    message: "Mother must be female.",
                });
            }
        }
        // Ensure all members belong to the same local church
        const allMembersBelongToSameChurch = members.every((member) => member.localChurch.toString() === localChurch);
        if (!allMembersBelongToSameChurch) {
            return res.status(400).json({
                success: false,
                message: "All members must belong to the same local church.",
            });
        }
        // Check for existing family in the same local church with the same name
        const existingFamily = await Family_1.default.findOne({
            _id: { $ne: id },
            familyName,
            localChurch,
        });
        if (existingFamily) {
            return res.status(409).json({
                success: false,
                message: "A family with the same name already exists in this local church.",
            });
        }
        // Update the family document
        const updatedFamily = await Family_1.default.findByIdAndUpdate(id, { familyName, father, mother, weddingDate, children, localChurch }, { new: true });
        if (!updatedFamily) {
            return res
                .status(404)
                .json({ success: false, message: "Family not found" });
        }
        res.status(200).json({
            success: true,
            data: updatedFamily,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating the family");
    }
};
exports.updateFamily = updateFamily;
// Delete council
const deleteFamily = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteFamily = await Family_1.default.findByIdAndDelete(id);
        if (!deleteFamily) {
            return res
                .status(404)
                .json({ success: false, message: "Family not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Family deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting family");
    }
};
exports.deleteFamily = deleteFamily;
//# sourceMappingURL=familyController.js.map