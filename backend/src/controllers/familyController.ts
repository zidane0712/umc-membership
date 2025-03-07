// [IMPORT]
// Express import
import { Request, Response } from "express";
import { Types } from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import Family from "../models/Family";
import Membership from "../models/Membership";
import Counter from "../models/Counter";
import { IMembership } from "../models/Membership";
import { AuthenticatedRequest } from "../middleware/authorize";
import Log from "../models/Logs";

// [CONTROLLERS]
// Get all family
export const getAllFamily = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { anniversaryMonth, search, page = 1, limit = 10 } = req.query;

    // Convert pagination params to numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    const anniversaryMonthInt =
      typeof anniversaryMonth === "string"
        ? parseInt(anniversaryMonth, 10)
        : undefined;

    const pipeline: any[] = [
      {
        $match: {
          localChurch: req.user?.localChurch,
        },
      },
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

    pipeline.push({
      $sort: { familyName: 1 },
    });

    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

    const families = await Family.aggregate(pipeline);

    // Get total count for pagination metadata
    const totalCountPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    const totalCount = await Family.aggregate([
      ...totalCountPipeline,
      { $count: "total" },
    ]);

    const count = totalCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: families,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all families");
  }
};

// Create a family
export const createFamily = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { familyName, father, mother, weddingDate, children, localChurch } =
      req.body;

    // Ensure the localChurch filed matches the logged-in user's localChurch
    if (localChurch !== req.user?.localChurch?.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only create a family for your own local church",
      });
    }

    // Ensure at least one of father, mother, or children is provided
    if (!father && !mother && (!children || children.length === 0)) {
      return res.status(400).json({
        success: false,
        message:
          "At least one of father, mother, or children must be provided.",
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
    const existingFamily = await Family.findOne({ familyName, localChurch });

    if (existingFamily) {
      return res.status(409).json({
        success: false,
        message: "Family already exists in this local church",
      });
    }

    // Validate father's and mother's IDs
    const memberIdsToCheck: Types.ObjectId[] = [
      father,
      mother,
      ...(Array.isArray(children) ? children : []), // Use children directly if it's already an array
    ].filter(Boolean) as Types.ObjectId[]; // Remove any undefined values and cast to ObjectId

    // Fetch members from the database using member IDs (explicitly typing the result)
    const members: (IMembership & { _id: Types.ObjectId })[] =
      await Membership.find({ _id: { $in: memberIdsToCheck } });

    // Check if any member is missing
    if (members.length !== memberIdsToCheck.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more members (father, mother, or children) do not exist in the Membership collection.",
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
    const counter = await Counter.findOneAndUpdate(
      { _id: "familyId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `FLC-${counter?.seq.toString().padStart(5, "0")}`;

    // Create a new Family
    const family = new Family({
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

    // Log the action done
    await Log.create({
      action: "created",
      collection: "Family",
      documentId: newFamily._id,
      data: newFamily.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      data: newFamily,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while creating the family");
  }
};

// Get family by id
export const getFamilyById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const family = await Family.findById(id)
      .populate("localChurch", "name")
      .populate("father", "name")
      .populate("mother", "name")
      .populate("children", "name");

    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    // Ensure the family belongs to the same local church as the logged-in user
    if (
      family.localChurch._id.toString() !== req.user?.localChurch?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only view families in your local church",
      });
    }

    res.status(200).json({ success: true, data: family });
  } catch (err) {
    handleError(res, err, "An error occurred while getting family");
  }
};

// Update family by id
export const updateFamily = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { familyName, father, mother, weddingDate, children, localChurch } =
    req.body;

  try {
    // Check if the family with the provided ID exists
    const existingFamilyById = await Family.findById(id);
    if (!existingFamilyById) {
      return res.status(404).json({
        success: false,
        message: "Family not found with the provided ID.",
      });
    }

    // Ensure the localChurch field matches the logged-in user's localChurch
    if (
      existingFamilyById.localChurch.toString() !==
      req.user?.localChurch?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only update families in your own local church.",
      });
    }

    // Ensure at least one of father, mother, or children is provided
    if (!father && !mother && (!children || children.length === 0)) {
      return res.status(400).json({
        success: false,
        message:
          "At least one of father, mother, or children must be provided.",
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
    const memberIdsToCheck: Types.ObjectId[] = [
      father,
      mother,
      ...(Array.isArray(children) ? children : []), // Use children directly if it's an array
    ].filter(Boolean) as Types.ObjectId[]; // Remove any undefined values and cast to ObjectId

    // Fetch members from the database using member IDs
    const members: (IMembership & { _id: Types.ObjectId })[] =
      await Membership.find({
        _id: { $in: memberIdsToCheck },
      });

    // Check if any member is missing
    if (members.length !== memberIdsToCheck.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more members (father, mother, or children) do not exist in the Membership collection.",
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

    // Check for existing family in the same local church with the same name
    const existingFamily = await Family.findOne({
      _id: { $ne: id },
      familyName,
      localChurch,
    });

    if (existingFamily) {
      return res.status(409).json({
        success: false,
        message:
          "A family with the same name already exists in this local church.",
      });
    }

    // Update the family document
    const updatedFamily = await Family.findByIdAndUpdate(
      id,
      { familyName, father, mother, weddingDate, children, localChurch },
      { new: true }
    );

    if (!updatedFamily) {
      return res
        .status(404)
        .json({ success: false, message: "Family not found" });
    }

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "Family",
      documentId: updatedFamily._id,
      data: updatedFamily.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      data: updatedFamily,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while updating the family");
  }
};

// Delete family
export const deleteFamily = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check if the family with the provided ID exists
    const existingFamily = await Family.findById(id);
    if (!existingFamily) {
      return res.status(404).json({
        success: false,
        message: "Family not found with the provided ID.",
      });
    }

    // Ensure the localChurch field matches the logged-in user's localChurch
    if (
      existingFamily.localChurch.toString() !==
      req.user?.localChurch?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only delete families in your own local church.",
      });
    }

    // Delete the family
    const deletedFamily = await Family.findByIdAndDelete(id);

    if (!deletedFamily) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    // Log the action done
    await Log.create({
      action: "deleted",
      collection: "Family",
      documentId: deletedFamily._id,
      data: deletedFamily.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Family deleted successfully",
    });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting family");
  }
};
