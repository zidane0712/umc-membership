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

// [CONTROLLERS]
// Get all family
export const getAllFamily = async (req: Request, res: Response) => {
  try {
    const { anniversaryMonth, search } = req.query;

    const anniversaryMonthInt =
      typeof anniversaryMonth === "string"
        ? parseInt(anniversaryMonth, 10)
        : undefined;

    const pipeline: any[] = [
      {
        $lookup: {
          from: "membership",
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
          from: "membership",
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
          from: "membership",
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

    const families = await Family.aggregate(pipeline);

    res.status(200).json({ success: true, data: families });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all families");
  }
};

// Create a family
export const createFamily = async (req: Request, res: Response) => {
  const { familyName, father, mother, weddingDate, children, localChurch } =
    req.body;

  try {
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
    res.status(201).json({
      success: true,
      data: newFamily,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while creating the family");
  }
};
