"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouncil = exports.updateCouncil = exports.getCouncilById = exports.createCouncil = exports.getAllCouncil = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const Council_1 = __importDefault(require("../models/Council"));
const Membership_1 = __importDefault(require("../models/Membership"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Get all council
const getAllCouncil = async (req, res) => {
    const { year } = req.query;
    try {
        const pipeline = [];
        // If a year is provided, filter councils by startYear or endYear
        if (year) {
            pipeline.push({
                $match: {
                    $expr: {
                        $eq: [{ $year: "$startYear" }, parseInt(year, 10)],
                    },
                },
            });
        }
        // Add population stages for all the required fields
        pipeline.push(
        // Populate localChurch
        {
            $lookup: {
                from: "locals",
                localField: "localChurch",
                foreignField: "_id",
                as: "localChurch",
            },
        }, { $unwind: { path: "$localChurch", preserveNullAndEmptyArrays: true } }, 
        // Administrative Office Population
        {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.chairperson",
                foreignField: "_id",
                as: "administrativeOffice.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.layLeader",
                foreignField: "_id",
                as: "administrativeOffice.layLeader",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.layDelegate",
                foreignField: "_id",
                as: "administrativeOffice.layDelegate",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.recordingSecretary",
                foreignField: "_id",
                as: "administrativeOffice.recordingSecretary",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.membershipSecretary",
                foreignField: "_id",
                as: "administrativeOffice.membershipSecretary",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.assistantSecretary",
                foreignField: "_id",
                as: "administrativeOffice.assistantSecretary",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.spprcChairperson",
                foreignField: "_id",
                as: "administrativeOffice.spprcChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.botChairperson",
                foreignField: "_id",
                as: "administrativeOffice.botChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.viceChairperson",
                foreignField: "_id",
                as: "administrativeOffice.viceChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.umyfPresident",
                foreignField: "_id",
                as: "administrativeOffice.umyfPresident",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.umyafPresident",
                foreignField: "_id",
                as: "administrativeOffice.umyafPresident",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.umwPresident",
                foreignField: "_id",
                as: "administrativeOffice.umwPresident",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "administrativeOffice.ummPresident",
                foreignField: "_id",
                as: "administrativeOffice.ummPresident",
            },
        }, 
        // Lookup for Nurture
        {
            $lookup: {
                from: "memberships",
                localField: "nurture.chairperson",
                foreignField: "_id",
                as: "nurture.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.worship",
                foreignField: "_id",
                as: "nurture.worship",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.assistant",
                foreignField: "_id",
                as: "nurture.assistant",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.sundaySchool",
                foreignField: "_id",
                as: "nurture.sundaySchool",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.christianEducation",
                foreignField: "_id",
                as: "nurture.christianEducation",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.stewardship",
                foreignField: "_id",
                as: "nurture.stewardship",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "nurture.members",
                foreignField: "_id",
                as: "nurture.members",
            },
        }, 
        // Lookup for Outreach
        {
            $lookup: {
                from: "memberships",
                localField: "outreach.chairperson",
                foreignField: "_id",
                as: "outreach.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "outreach.viceChairperson",
                foreignField: "_id",
                as: "outreach.viceChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "outreach.members",
                foreignField: "_id",
                as: "outreach.members",
            },
        }, 
        // Lookup for Witness
        {
            $lookup: {
                from: "memberships",
                localField: "witness.chairperson",
                foreignField: "_id",
                as: "witness.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "witness.viceChairperson",
                foreignField: "_id",
                as: "witness.viceChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "witness.membershipCare",
                foreignField: "_id",
                as: "witness.membershipCare",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "witness.members",
                foreignField: "_id",
                as: "witness.members",
            },
        }, 
        // Lookup for Church Historian
        {
            $lookup: {
                from: "memberships",
                localField: "churchHistorian.chairperson",
                foreignField: "_id",
                as: "churchHistorian.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "churchHistorian.assistant",
                foreignField: "_id",
                as: "churchHistorian.assistant",
            },
        }, 
        // Lookup for Communications
        {
            $lookup: {
                from: "memberships",
                localField: "communications.chairperson",
                foreignField: "_id",
                as: "communications.chairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "communications.assistant",
                foreignField: "_id",
                as: "communications.assistant",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "communications.members",
                foreignField: "_id",
                as: "communications.members",
            },
        }, 
        // Lookup for Finance
        {
            $lookup: {
                from: "memberships",
                localField: "finance.financeChairperson",
                foreignField: "_id",
                as: "finance.financeChairperson",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "finance.treasurer",
                foreignField: "_id",
                as: "finance.treasurer",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "finance.auditor",
                foreignField: "_id",
                as: "finance.auditor",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "finance.financeSecretary",
                foreignField: "_id",
                as: "finance.financeSecretary",
            },
        }, {
            $lookup: {
                from: "memberships",
                localField: "finance.members",
                foreignField: "_id",
                as: "finance.members",
            },
        }, 
        // Add the rest of your $lookup operations here for nurture, finance, etc.
        // Group results to avoid duplication
        {
            $group: {
                _id: "$_id",
                startYear: { $first: "$startYear" },
                endYear: { $first: "$endYear" },
                localChurch: { $first: "$localChurch" },
                administrativeOffice: { $first: "$administrativeOffice" },
                nurture: { $first: "$nurture" },
                finance: { $first: "$finance" },
                outreach: { $first: "$outreach" },
                witness: { $first: "$witness" },
                churchHistorian: { $first: "$churchHistorian" },
                communications: { $first: "$communications" },
            },
        }, 
        // Project only the necessary fields
        {
            $project: {
                // Administrative Office
                "administrativeOffice.chairperson._id": 1,
                "administrativeOffice.chairperson.name": 1,
                "administrativeOffice.layLeader._id": 1,
                "administrativeOffice.layLeader.name": 1,
                "administrativeOffice.layDelegate._id": 1,
                "administrativeOffice.layDelegate.name": 1,
                "administrativeOffice.recordingSecretary._id": 1,
                "administrativeOffice.recordingSecretary.name": 1,
                "administrativeOffice.membershipSecretary._id": 1,
                "administrativeOffice.membershipSecretary.name": 1,
                "administrativeOffice.assistantSecretary._id": 1,
                "administrativeOffice.assistantSecretary.name": 1,
                "administrativeOffice.spprcChairperson._id": 1,
                "administrativeOffice.spprcChairperson.name": 1,
                "administrativeOffice.botChairperson._id": 1,
                "administrativeOffice.botChairperson.name": 1,
                "administrativeOffice.viceChairperson._id": 1,
                "administrativeOffice.viceChairperson.name": 1,
                "administrativeOffice.umyfPresident._id": 1,
                "administrativeOffice.umyfPresident.name": 1,
                "administrativeOffice.umyafPresident._id": 1,
                "administrativeOffice.umyafPresident.name": 1,
                "administrativeOffice.umwPresident._id": 1,
                "administrativeOffice.umwPresident.name": 1,
                "administrativeOffice.ummPresident._id": 1,
                "administrativeOffice.ummPresident.name": 1,
                // Nurture
                "nurture.chairperson._id": 1,
                "nurture.chairperson.name": 1,
                "nurture.worship._id": 1,
                "nurture.worship.name": 1,
                "nurture.assistant._id": 1,
                "nurture.assistant.name": 1,
                "nurture.sundaySchool._id": 1,
                "nurture.sundaySchool.name": 1,
                "nurture.christianEducation._id": 1,
                "nurture.christianEducation.name": 1,
                "nurture.stewardship._id": 1,
                "nurture.stewardship.name": 1,
                "nurture.members._id": 1,
                "nurture.members.name": 1,
                // Outreach
                "outreach.chairperson._id": 1,
                "outreach.chairperson.name": 1,
                "outreach.viceChairperson._id": 1,
                "outreach.viceChairperson.name": 1,
                "outreach.members._id": 1,
                "outreach.members.name": 1,
                // Witness
                "witness.chairperson._id": 1,
                "witness.chairperson.name": 1,
                "witness.viceChairperson._id": 1,
                "witness.viceChairperson.name": 1,
                "witness.membershipCare._id": 1,
                "witness.membershipCare.name": 1,
                "witness.members._id": 1,
                "witness.members.name": 1,
                // Church Historian
                "churchHistorian.chairperson._id": 1,
                "churchHistorian.chairperson.name": 1,
                "churchHistorian.assistant._id": 1,
                "churchHistorian.assistant.name": 1,
                // Communications
                "communications.chairperson._id": 1,
                "communications.chairperson.name": 1,
                "communications.assistant._id": 1,
                "communications.assistant.name": 1,
                "communications.members._id": 1,
                "communications.members.name": 1,
                // Finance
                "finance.financeChairperson._id": 1,
                "finance.financeChairperson.name": 1,
                "finance.treasurer._id": 1,
                "finance.treasurer.name": 1,
                "finance.auditor._id": 1,
                "finance.auditor.name": 1,
                "finance.financeSecretary._id": 1,
                "finance.financeSecretary.name": 1,
                "finance.members._id": 1,
                "finance.members.name": 1,
                // Include any other relevant fields from the council
                startYear: 1,
                endYear: 1,
                "localChurch._id": 1,
                "localChurch.name": 1,
            },
        });
        // Run the aggregation pipeline
        const councils = await Council_1.default.aggregate(pipeline);
        // Ensure councils is not null and return appropriate response
        if (councils.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No councils found",
            });
        }
        res.status(200).json({ success: true, data: councils });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all councils");
    }
};
exports.getAllCouncil = getAllCouncil;
// Create a new council
const createCouncil = async (req, res) => {
    const { startYear, endYear, administrativeOffice, localChurch, nurture, outreach, witness, churchHistorian, communications, finance, } = req.body;
    try {
        // Validate that endYear is greater than startYear and at least 1 year apart
        const startDate = new Date(startYear);
        const endDate = new Date(endYear);
        const oneYearInMilliseconds = 12 * 30 * 24 * 60 * 60 * 1000; // Roughly 12 months in milliseconds
        if (endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: "The end year must be greater than the start year.",
            });
        }
        if (endDate.getTime() - startDate.getTime() < oneYearInMilliseconds) {
            return res.status(400).json({
                success: false,
                message: "The end year must be at least 12 months after the start year.",
            });
        }
        // Check if a council with the same startYear and endYear already exists
        const existingCouncil = await Council_1.default.findOne({
            startYear,
            endYear,
            localChurch,
        });
        if (existingCouncil) {
            return res.status(400).json({
                success: false,
                message: "A council with the same startYear and endYear already exists.",
            });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "councilId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom id
        const customId = `CLC-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // Collect all member IDs from various positions
        const memberIds = [
            administrativeOffice.chairperson,
            administrativeOffice.layLeader,
            administrativeOffice.layDelegate,
            administrativeOffice.recordingSecretary,
            administrativeOffice.membershipSecretary,
            administrativeOffice.assistantSecretary,
            administrativeOffice.spprcChairperson,
            administrativeOffice.botChairperson,
            administrativeOffice.viceChairperson,
            administrativeOffice.umyfPresident,
            administrativeOffice.umyafPresident,
            administrativeOffice.umwPresident,
            administrativeOffice.ummPresident,
            nurture.chairperson,
            nurture.worship,
            nurture.assistant,
            nurture.sundaySchool,
            nurture.christianEducation,
            nurture.stewardship,
            ...nurture.members,
            outreach.chairperson,
            outreach.viceChairperson,
            ...outreach.members,
            witness.chairperson,
            witness.viceChairperson,
            witness.membershipCare,
            ...witness.members,
            churchHistorian.chairperson,
            churchHistorian.assistant,
            communications.chairperson,
            communications.assistant,
            ...communications.members,
            finance.financeChairperson,
            finance.treasurer,
            finance.auditor,
            finance.financeSecretary,
            ...finance.members,
        ];
        // Create a unique set of member IDs
        const uniqueMemberIds = Array.from(new Set(memberIds));
        // Fetch members from the database using unique member IDs
        const members = await Membership_1.default.find({ _id: { $in: uniqueMemberIds } });
        // Check if any member is missing
        if (members.length !== uniqueMemberIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more members do not exist in the Membership collection.",
            });
        }
        // Ensure that all members belong to the same local church
        const allMembersBelongToSameChurch = members.every((member) => member.localChurch.toString() === localChurch);
        if (!allMembersBelongToSameChurch) {
            return res.status(400).json({
                success: false,
                message: "All members must belong to the same local church.",
            });
        }
        // Create and save the council if validation passes
        const council = new Council_1.default(Object.assign(Object.assign({}, req.body), { customId }));
        const newCouncil = await council.save();
        res.status(201).json(newCouncil);
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while creating council");
    }
};
exports.createCouncil = createCouncil;
// Get council by id
const getCouncilById = async (req, res) => {
    try {
        const { id } = req.params;
        const council = await Council_1.default.findById(id)
            .populate("localChurch", "name")
            // Administrative Office Populates
            .populate("administrativeOffice.chairperson", "name")
            .populate("administrativeOffice.layLeader", "name")
            .populate("administrativeOffice.layDelegate", "name")
            .populate("administrativeOffice.recordingSecretary", "name")
            .populate("administrativeOffice.membershipSecretary", "name")
            .populate("administrativeOffice.assistantSecretary", "name")
            .populate("administrativeOffice.spprcChairperson", "name")
            .populate("administrativeOffice.botChairperson", "name")
            .populate("administrativeOffice.viceChairperson", "name")
            .populate("administrativeOffice.umyfPresident", "name")
            .populate("administrativeOffice.umyafPresident", "name")
            .populate("administrativeOffice.umwPresident", "name")
            .populate("administrativeOffice.ummPresident", "name")
            // Nurture Populates
            .populate("nurture.chairperson", "name")
            .populate("nurture.worship", "name")
            .populate("nurture.assistant", "name")
            .populate("nurture.sundaySchool", "name")
            .populate("nurture.christianEducation", "name")
            .populate("nurture.stewardship", "name")
            .populate("nurture.members", "name")
            // Outreach Populates
            .populate("outreach.chairperson", "name")
            .populate("outreach.viceChairperson", "name")
            .populate("outreach.members", "name")
            // Witness Populates
            .populate("witness.chairperson", "name")
            .populate("witness.viceChairperson", "name")
            .populate("witness.membershipCare", "name")
            .populate("witness.members", "name")
            // Church Historian Populates
            .populate("churchHistorian.chairperson", "name")
            .populate("churchHistorian.assistant", "name")
            // Communications Populates
            .populate("communications.chairperson", "name")
            .populate("communications.assistant", "name")
            .populate("communications.members", "name")
            // Finance Populates
            .populate("finance.financeChairperson", "name")
            .populate("finance.treasurer", "name")
            .populate("finance.auditor", "name")
            .populate("finance.financeSecretary", "name")
            .populate("finance.members", "name");
        if (!council) {
            return res.status(404).json({ message: "Council not found" });
        }
        res.status(200).json({ success: true, data: council });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting council");
    }
};
exports.getCouncilById = getCouncilById;
// Update local church by id
const updateCouncil = async (req, res) => {
    try {
        const { id } = req.params;
        const { startYear, endYear, administrativeOffice, localChurch, nurture, outreach, witness, churchHistorian, communications, finance, } = req.body;
        // Check if the council with the provided ID exists
        const existingCouncilById = await Council_1.default.findById(id);
        if (!existingCouncilById) {
            return res.status(404).json({
                success: false,
                message: "Council not found with the provided ID.",
            });
        }
        // Validate that endYear is greater than startYear and at least 1 year apart
        const startDate = new Date(startYear);
        const endDate = new Date(endYear);
        const oneYearInMilliseconds = 12 * 30 * 24 * 60 * 60 * 1000; // Roughly 12 months in milliseconds
        if (endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: "The end year must be greater than the start year.",
            });
        }
        if (endDate.getTime() - startDate.getTime() < oneYearInMilliseconds) {
            return res.status(400).json({
                success: false,
                message: "The end year must be at least 12 months after the start year.",
            });
        }
        // Check if a council with the same startYear, endYear, and localChurch already exists (excluding the current one)
        const existingCouncil = await Council_1.default.findOne({
            _id: { $ne: id }, // Exclude the current council being updated
            startYear,
            endYear,
            localChurch,
        });
        if (existingCouncil) {
            return res.status(400).json({
                success: false,
                message: "A council with the same startYear, endYear, and localChurch already exists.",
            });
        }
        // Collect all member IDs from various positions
        const memberIds = [
            administrativeOffice.chairperson,
            administrativeOffice.layLeader,
            administrativeOffice.layDelegate,
            administrativeOffice.recordingSecretary,
            administrativeOffice.membershipSecretary,
            administrativeOffice.assistantSecretary,
            administrativeOffice.spprcChairperson,
            administrativeOffice.botChairperson,
            administrativeOffice.viceChairperson,
            administrativeOffice.umyfPresident,
            administrativeOffice.umyafPresident,
            administrativeOffice.umwPresident,
            administrativeOffice.ummPresident,
            nurture.chairperson,
            nurture.worship,
            nurture.assistant,
            nurture.sundaySchool,
            nurture.christianEducation,
            nurture.stewardship,
            ...nurture.members,
            outreach.chairperson,
            outreach.viceChairperson,
            ...outreach.members,
            witness.chairperson,
            witness.viceChairperson,
            witness.membershipCare,
            ...witness.members,
            churchHistorian.chairperson,
            churchHistorian.assistant,
            communications.chairperson,
            communications.assistant,
            ...communications.members,
            finance.financeChairperson,
            finance.treasurer,
            finance.auditor,
            finance.financeSecretary,
            ...finance.members,
        ];
        // Create a unique set of member IDs
        const uniqueMemberIds = Array.from(new Set(memberIds));
        // Fetch members from the database using unique member IDs
        const members = await Membership_1.default.find({ _id: { $in: uniqueMemberIds } });
        // Check if any member is missing
        if (members.length !== uniqueMemberIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more members do not exist in the Membership collection.",
            });
        }
        // Ensure that all members belong to the same local church
        const allMembersBelongToSameChurch = members.every((member) => member.localChurch.toString() === localChurch);
        if (!allMembersBelongToSameChurch) {
            return res.status(400).json({
                success: false,
                message: "All members must belong to the same local church.",
            });
        }
        // Update the council if validation passes
        const updateCouncil = await Council_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateCouncil) {
            return res.status(404).json({ message: "Council not found" });
        }
        res.status(200).json({ success: true, data: updateCouncil });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while updating council");
    }
};
exports.updateCouncil = updateCouncil;
// Delete council
const deleteCouncil = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCouncil = await Council_1.default.findByIdAndDelete(id);
        if (!deleteCouncil) {
            return res
                .status(404)
                .json({ success: false, message: "Council not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Council deleted successfully" });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting council");
    }
};
exports.deleteCouncil = deleteCouncil;
//# sourceMappingURL=councilController.js.map