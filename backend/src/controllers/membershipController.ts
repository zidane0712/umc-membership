// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import Membership from "../models/Membership";
import Annual from "../models/Annual";
import District from "../models/District";
import Local from "../models/Local";
import Ministry from "../models/Ministries";
import Counter from "../models/Counter";
import Log from "../models/Logs";
import { AuthenticatedRequest } from "../middleware/authorize";

// [CONTROLLERS]
// Gets all membership
export const getAllMemberships = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      gender,
      civilStatus,
      birthMonth,
      baptized,
      confirmed,
      membershipClassification,
      isActive,
      localChurch,
      district,
      annualConference,
      episcopalArea,
      age,
      organization,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    const birthMonthInt =
      typeof birthMonth === "string" ? parseInt(birthMonth, 10) : undefined;

    const pipeline: any[] = [
      {
        $lookup: {
          from: "locals",
          localField: "localChurch",
          foreignField: "_id",
          as: "localChurch",
        },
      },
      { $unwind: "$localChurch" },
      {
        $lookup: {
          from: "districts",
          localField: "localChurch.district",
          foreignField: "_id",
          as: "localChurch.district",
        },
      },
      { $unwind: "$localChurch.district" },
      {
        $lookup: {
          from: "annuals",
          localField: "localChurch.district.annualConference",
          foreignField: "_id",
          as: "localChurch.district.annualConference",
        },
      },
      { $unwind: "$localChurch.district.annualConference" },
      {
        $lookup: {
          from: "ministries",
          localField: "ministries",
          foreignField: "_id",
          as: "ministries",
        },
      },
    ];

    // Filters
    const matchFilters: any = {};
    if (gender) matchFilters.gender = gender;
    if (civilStatus) matchFilters.civilStatus = civilStatus;
    if (birthMonthInt !== undefined) {
      matchFilters.$expr = { $eq: [{ $month: "$birthday" }, birthMonthInt] };
    }
    if (baptized !== undefined) matchFilters.isBaptized = baptized === "true";
    if (confirmed !== undefined)
      matchFilters.isConfirmed = confirmed === "true";
    if (membershipClassification) {
      matchFilters.membershipClassification = membershipClassification;
    }
    if (isActive !== undefined) {
      matchFilters.isActive = isActive === "true";
    }
    if (localChurch) {
      matchFilters["localChurch._id"] = new Types.ObjectId(
        localChurch as string
      );
    }
    if (district) {
      matchFilters["localChurch.district._id"] = new Types.ObjectId(
        district as string
      );
    }
    if (annualConference) {
      matchFilters["localChurch.district.annualConference._id"] =
        new Types.ObjectId(annualConference as string);
    }
    if (episcopalArea) {
      matchFilters["localChurch.district.annualConference.episcopalArea"] =
        episcopalArea;
    }
    if (age !== undefined) matchFilters.age = parseInt(age as string, 10);
    if (organization) matchFilters.organization = organization;

    // Role-based filtering
    if (req.user?.role === "annual") {
      matchFilters["localChurch.district.annualConference._id"] =
        req.user.annual;
    } else if (req.user?.role === "district") {
      matchFilters["localChurch.district._id"] = req.user.district;
    } else if (req.user?.role === "local") {
      matchFilters["localChurch._id"] = req.user.localChurch;
    }

    // Search filters
    if (search) {
      matchFilters.$or = [
        { "name.firstname": { $regex: search, $options: "i" } },
        { "name.lastname": { $regex: search, $options: "i" } },
        { customId: { $regex: search, $options: "i" } },
        { "address.permanent.barangay": { $regex: search, $options: "i" } },
        { "address.current.barangay": { $regex: search, $options: "i" } },
      ];
    }

    // Match stage
    pipeline.push({ $match: matchFilters });

    // Pagination and sorting
    pipeline.push(
      { $sort: { createdAt: -1 } }, // Sort by creation date (descending)
      { $skip: (pageNum - 1) * limitNum }, // Skip documents for the current page
      { $limit: limitNum } // Limit documents to the page size
    );

    // Projection for returned fields
    pipeline.push({
      $project: {
        name: 1,
        address: 1,
        gender: 1,
        civilStatus: 1,
        birthday: 1,
        contactNo: 1,
        isBaptized: 1,
        isConfirmed: 1,
        membershipClassification: 1,
        isActive: 1,
        localChurch: {
          _id: 1,
          name: 1,
          district: {
            _id: 1,
            name: 1,
            annualConference: {
              _id: 1,
              name: 1,
              episcopalArea: 1,
            },
          },
        },
        age: 1,
        organization: 1,
        ministries: { _id: 1, name: 1 },
        customId: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    // Execute the pipeline
    const memberships = await Membership.aggregate(pipeline);

    // Total count for pagination metadata
    const countPipeline = [...pipeline.slice(0, -3), { $count: "total" }];
    const countResult = await Membership.aggregate(countPipeline);
    const totalMemberships = countResult.length > 0 ? countResult[0].total : 0;

    // Response metadata
    const meta = {
      total: totalMemberships,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalMemberships / limitNum),
    };

    // Return data and metadata
    res.status(200).json({ success: true, data: memberships, meta });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all memberships");
  }
};

// Create a new membership
export const createMembership = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, birthday, district, localChurch } = req.body;

  try {
    // Check if the birthday is in the future
    if (birthday && new Date(birthday) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Birthday date must not be greater than the current date.",
      });
    }

    // Role-based access control: Ensure the localChurch in the body matches the logged-in user's localChurch
    if (
      req.user?.role === "local" &&
      !new Types.ObjectId(localChurch).equals(req.user.localChurch)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You can only create memberships for your own local church.",
      });
    }

    // Check if a membership already exists with the same name, district, and local church
    const existingMembership = await Membership.findOne({
      name,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "Member already exists",
      });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "membershipId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `UMC-${counter?.seq.toString().padStart(5, "0")}`;

    // If it doesn't exist, create a new membership
    const membership = new Membership({ ...req.body, customId });
    const newMembership = await membership.save();

    // Log the action done
    await Log.create({
      action: "created",
      collection: "Membership",
      documentId: newMembership._id,
      data: newMembership.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(201).json(newMembership);
  } catch (err) {
    handleError(res, err, "An error occurred while creating member");
  }
};

// Get a single membership by ID
export const getMemberById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const member = await Membership.findById(id)
      .populate({
        path: "localChurch",
        select: "_id name district",
        populate: {
          path: "district",
          select: "_id name annualConference",
          populate: {
            path: "annualConference",
            select: "_id name episcopalArea",
          },
        },
      })
      .populate("ministries", "name");

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    // Role-based access control
    if (
      req.user?.role === "local" &&
      !member.localChurch._id.equals(req.user.localChurch)
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, data: member });
  } catch (err) {
    handleError(res, err, "An error occurred while getting member by id");
  }
};

// Update a member by ID
export const updateMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      name,
      localChurch,
      district,
      annualConference,
      baptism,
      confirmation,
    } = req.body;

    const trimmedFirstname = name?.firstname.trim();
    const trimmedMiddlename = name?.middlename.trim();
    const trimmedLastName = name?.lastname.trim();

    // Check if there's another membership with same name, district, and annual conference
    const existingMembership = await Membership.findOne({
      name: {
        firstname: trimmedFirstname,
        middlename: trimmedMiddlename,
        lastname: trimmedLastName,
      },
      localChurch,
      district,
      annualConference,
      _id: { $ne: id },
    });

    // Role-based access control: Ensure the localChurch in the body matches the logged-in user's localChurch
    if (
      req.user?.role === "local" &&
      !new Types.ObjectId(localChurch).equals(req.user.localChurch)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You can only update memberships for your own local church.",
      });
    }

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message:
          "A membership with this name, localChurch, district, and annual conference already exists.",
      });
    }

    if (annualConference) {
      const annualConferenceCheck = await Annual.findById(annualConference);
      if (!annualConferenceCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Annual Conference reference." });
      }
    }

    if (district) {
      const districtCheck = await District.findById(district);
      if (!districtCheck) {
        return res
          .status(400)
          .json({ message: "Invalid District Conference reference." });
      }
    }

    if (localChurch) {
      const localChurchCheck = await Local.findById(localChurch);
      if (!localChurchCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    // Automatically set isBaptized to true if baptism info is provided
    if (baptism && (baptism.year || baptism.officiatingMinister)) {
      req.body.isBaptized = true;
    } else {
      req.body.isBaptized = false;
    }

    // Automatically set isConfirmed to true if confirmation info is provided
    if (
      confirmation &&
      (confirmation.year || confirmation.officiatingMinister)
    ) {
      req.body.isConfirmed = true;
    } else {
      req.body.isConfirmed = false;
    }

    const updateMembership = await Membership.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    // Log the action
    await Log.create({
      action: "updated",
      collection: "Membership",
      documentId: updateMembership._id,
      data: { prevData: updateMembership.toObject() },
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json(updateMembership);
  } catch (err) {
    handleError(res, err, "An error occurred while updating member");
  }
};

// Delete a member
export const deleteMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const deletedMember = await Membership.findById(id).populate({
      path: "localChurch",
      select: "_id",
    });

    if (!deletedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    // Role-based access control
    if (
      req.user?.role === "local" &&
      !deletedMember.localChurch._id.equals(req.user.localChurch)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You can only delete memberships for your own local church.",
      });
    }

    await deletedMember.deleteOne();

    await Log.create({
      action: "deleted",
      collection: "Membership",
      documentId: deletedMember._id,
      data: deletedMember.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting member");
  }
};

// Add multiple ministries to a member
export const addMinistriesToMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { ministryIds }: { ministryIds: Types.ObjectId[] } = req.body;

    const userLocalChurch = req.user?.localChurch;

    // Find the member by ID
    const member = await Membership.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Ensure the member belongs to the same local church as the logged-in user
    if (!member.localChurch.equals(userLocalChurch)) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: Member does not belong to your local church",
      });
    }

    // Initialize ministries array if undefined
    const updatedMinistries = member.ministries || [];

    // Find the ministries by IDs
    const ministries = await Ministry.find({ _id: { $in: ministryIds } });

    if (ministries.length !== ministryIds.length) {
      return res
        .status(404)
        .json({ message: "One or more ministries not found" });
    }

    // Ensure ministries belong to the same local church as the member
    for (const ministry of ministries) {
      if (!ministry.localChurch.equals(member.localChurch)) {
        return res.status(400).json({
          message:
            "All ministries and the member must belong to the same local church",
        });
      }
    }

    // Add ministries to the member if not already added
    const newMinistryIds = ministryIds.filter(
      (ministryId) => !updatedMinistries!.includes(ministryId)
    );
    if (newMinistryIds.length > 0) {
      updatedMinistries.push(...newMinistryIds);
    }

    // Use findOneAndUpdate to update the ministries
    const updatedMember = await Membership.findOneAndUpdate(
      { _id: id },
      { $set: { ministries: updatedMinistries } }, // Update ministries
      { new: true } // Return the updated document
    );

    if (updatedMember) {
      // Add the member to each ministry if not already added
      const updates = ministries.map(async (ministry) => {
        ministry.members = ministry.members || [];
        if (
          !ministry.members.some((memberId) =>
            memberId.equals(updatedMember._id as Types.ObjectId)
          )
        ) {
          ministry.members.push(updatedMember._id as Types.ObjectId);
          await ministry.save();
        }
      });
      await Promise.all(updates);

      // Log the action done
      await Log.create({
        action: "updated",
        collection: "Membership",
        documentId: member._id,
        data: {
          prevData: member.toObject(),
          newData: { ministries: newMinistryIds },
        },
        performedBy: req.user?._id,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Ministries successfully added to member",
      });
    } else {
      res
        .status(404)
        .json({ message: "Failed to update ministries for member" });
    }
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while adding ministries to the member"
    );
  }
};

// Remove multiple ministries from a member
export const removeMinistriesFromMember = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { ministryIds }: { ministryIds: Types.ObjectId[] } = req.body;

    const userLocalChurch = req.user?.localChurch;

    // Find the member by ID
    const member = await Membership.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Ensure the member belongs to the same local church as the logged-in user
    if (!member.localChurch.equals(userLocalChurch)) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: Member does not belong to your local church",
      });
    }

    // Initialize ministries array if undefined
    const updatedMinistries = member.ministries || [];

    // Filter for valid ministryIds that are currently in the member's ministries
    const ministriesToRemove = ministryIds.filter((ministryId) =>
      updatedMinistries.includes(ministryId)
    );

    if (ministriesToRemove.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching ministries found for the member" });
    }

    // Use findOneAndUpdate to update the ministries by pulling the ones to remove
    const updatedMember = await Membership.findOneAndUpdate(
      { _id: id },
      { $pull: { ministries: { $in: ministriesToRemove } } }, // Remove ministries
      { new: true } // Return the updated document
    );

    if (updatedMember) {
      // Remove the member from each ministry's members array
      const updates = ministriesToRemove.map(async (ministryId) => {
        const ministry = await Ministry.findById(ministryId);
        if (ministry) {
          ministry.members = ministry.members || [];
          if (
            ministry.members.some((memberId) =>
              memberId.equals(updatedMember._id as Types.ObjectId)
            )
          ) {
            ministry.members = ministry.members.filter(
              (memberId) =>
                !memberId.equals(updatedMember._id as Types.ObjectId)
            );
            await ministry.save();
          }
        }
      });
      await Promise.all(updates);

      // Log the action done
      await Log.create({
        action: "updated",
        collection: "Membership",
        documentId: member._id,
        data: {
          prevData: member.toObject(),
          newData: { ministries: ministriesToRemove },
        },
        performedBy: req.user?._id,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Ministries successfully removed from member",
      });
    } else {
      res
        .status(404)
        .json({ message: "Failed to update ministries for member" });
    }
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while removing ministries from the member"
    );
  }
};
