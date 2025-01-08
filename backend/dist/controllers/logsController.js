"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLogs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Logs_1 = __importDefault(require("../models/Logs"));
const handleError_1 = require("../utils/handleError");
// [CONTROLLER]
const getAllLogs = async (req, res) => {
    try {
        const user = req.user; // Get the authenticated user
        // Check user's role and filter logs accordingly
        const { action, collection, documentId } = req.query;
        const pipeline = [];
        // If action is provided, add it to the match stage
        if (action) {
            pipeline.push({
                $match: { action: action },
            });
        }
        // If collection is provided, add it to the match stage
        if (collection) {
            pipeline.push({
                $match: { collection: collection },
            });
        }
        // If documentId is provided, add it to the match stage
        if (documentId) {
            pipeline.push({
                $match: {
                    documentId: new mongoose_1.default.Types.ObjectId(documentId),
                },
            });
        }
        // Apply role-based filtering
        if (user.role === "annual") {
            pipeline.push({
                $match: {
                    $or: [
                        { performedBy: user._id },
                        { "data.annual": user.annual },
                        { "data.district": user.district },
                        { "data.localChurch": user.localChurch },
                    ],
                },
            });
        }
        else if (user.role === "district") {
            pipeline.push({
                $match: {
                    $or: [
                        { performedBy: user._id },
                        { "data.district": user.district },
                        { "data.localChurch": user.localChurch },
                    ],
                },
            });
        }
        else if (user.role === "local") {
            pipeline.push({
                $match: {
                    $or: [
                        { performedBy: user._id },
                        { "data.localChurch": user.localChurch },
                    ],
                },
            });
        }
        pipeline.push({
            $sort: { timestamp: -1 },
        });
        // Fetch the logs based on the constructed pipeline
        const logs = await Logs_1.default.aggregate(pipeline);
        res.status(200).json({ success: true, data: logs });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all logs");
    }
};
exports.getAllLogs = getAllLogs;
//# sourceMappingURL=logsController.js.map