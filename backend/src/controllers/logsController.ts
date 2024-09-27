// [IMPORT]
// Global import
import { Request, Response } from "express";
import mongoose from "mongoose";
// Local import
import Logs from "../models/Logs";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]
// Get all logs
export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const { action, collection, documentId } = req.query;

    const pipeline: any[] = [];

    // If action is provided, add it to the match stage
    if (action) {
      pipeline.push({
        $match: {
          action: action,
        },
      });
    }

    // If collection is provided, add it to the match stage
    if (collection) {
      pipeline.push({
        $match: {
          collection: collection,
        },
      });
    }

    // If documentId is provided, add it to the match stage
    if (documentId) {
      pipeline.push({
        $match: {
          documentId: new mongoose.Types.ObjectId(documentId as string),
        },
      });
    }

    pipeline.push({
      $sort: { name: 1 },
    });

    const logs = await Logs.aggregate(pipeline);

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all logs");
  }
};
