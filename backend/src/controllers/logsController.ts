// [IMPORT]
// Global import
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
// Local import
import Logs from "../models/Logs";
import { handleError } from "../utils/handleError";
import { AuthenticatedRequest } from "../middleware/authorize";

// [CONTROLLERS]
// Get all logs
export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const { action, collection, documentId, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

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
      $sort: { timestamp: -1 },
    });

    pipeline.push(
      {
        $skip: (pageNum - 1) * limitNum,
      },
      { $limit: limitNum }
    );

    const logs = await Logs.aggregate(pipeline);

    const totalLogs = await Logs.countDocuments({
      ...(action && { action }),
      ...(collection && { collection }),
      ...(documentId && {
        documentId: new mongoose.Types.ObjectId(documentId as string),
      }),
    });

    const meta = {
      total: totalLogs,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalLogs / limitNum),
    };

    res.status(200).json({ success: true, data: logs, meta });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all logs");
  }
};

// Get all local logs
export const getLocalLogs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { action, collection, documentId, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    const pipeline: any[] = [];

    if (user.role === "local") {
      pipeline.push({
        $match: {
          performedBy: new Types.ObjectId(user.localChurch),
        },
      });
    }

    const searchFilter: any = {};
    if (action) searchFilter.action = { $regex: action, $options: "i" };
    if (collection)
      searchFilter.collection = { $regex: collection, $options: "i" };

    if (Object.keys(searchFilter).length > 0) {
      pipeline.push({
        $match: searchFilter,
      });
    }

    pipeline.push({
      $sort: { timestamp: -1 },
    });

    pipeline.push(
      {
        $skip: (pageNum - 1) * limitNum,
      },
      {
        $limit: limitNum,
      }
    );

    const logs = await Logs.aggregate(pipeline);

    // Calculate the total number of logs matching the filter
    const totalLogs = await Logs.countDocuments({
      performedBy:
        user.role === "local"
          ? new mongoose.Types.ObjectId(user.localChurch)
          : undefined,
      ...(action && { action: { $regex: action, $options: "i" } }),
      ...(collection && { collection: { $regex: collection, $options: "i" } }),
    });

    // Metadata
    const meta = {
      total: totalLogs,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalLogs / limitNum),
    };

    return res.status(200).json({ success: true, data: logs, meta });
  } catch (err) {
    handleError(res, err, "An error occurred while getting local logs");
  }
};
