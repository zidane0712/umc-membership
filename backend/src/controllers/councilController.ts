// [IMPORT]
// Express import
import { Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import Council from "../models/Council";
import Membership from "../models/Membership";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Get all council
export const getAllCouncil = async (req: Request, res: Response) => {
  const { year } = req.query;

  try {
    const pipeline: any[] = [];

    // If a year is provided, filter councils by startYear or endYear
    if (year) {
      pipeline.push({
        $match: {
          $expr: {
            $eq: [{ $year: "$startYear" }, parseInt(year as string, 10)],
          },
        },
      });
    }

    // Add population stages for all the required fields
    pipeline.push(
      // Populate localChurch
      {
        $lookup: {
          from: "localchurches",
          localField: "localChurch",
          foreignField: "_id",
          as: "localChurch",
        },
      },
      { $unwind: { path: "$localChurch", preserveNullAndEmptyArrays: true } },

      // Populate administrative office members
      {
        $lookup: {
          from: "memberships",
          localField: "administrativeOffice.chairperson",
          foreignField: "_id",
          as: "administrativeOffice.chairperson",
        },
      },
      {
        $unwind: {
          path: "$administrativeOffice.chairperson",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "administrativeOffice.layLeader",
          foreignField: "_id",
          as: "administrativeOffice.layLeader",
        },
      },
      {
        $unwind: {
          path: "$administrativeOffice.layLeader",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Add lookup/unwind for other administrative office members...

      // Populate nurture members
      {
        $lookup: {
          from: "memberships",
          localField: "nurture.members",
          foreignField: "_id",
          as: "nurture.members",
        },
      },
      {
        $unwind: { path: "$nurture.members", preserveNullAndEmptyArrays: true },
      },

      // Continue lookup/unwind for other nurture, outreach, witness, communications, etc.

      // Populate finance members
      {
        $lookup: {
          from: "memberships",
          localField: "finance.members",
          foreignField: "_id",
          as: "finance.members",
        },
      },
      {
        $unwind: { path: "$finance.members", preserveNullAndEmptyArrays: true },
      }
    );

    // Run the aggregation pipeline
    const councils = await Council.aggregate(pipeline);

    // Ensure councils is not null and return appropriate response
    if (councils.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No councils found",
      });
    }

    res.status(200).json({ success: true, data: councils });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all councils");
  }
};

// Create a new council
export const createCouncil = async (req: Request, res: Response) => {
  const {
    startYear,
    endYear,
    administrativeOffice,
    localChurch,
    nurture,
    outreach,
    witness,
    churchHistorian,
    communications,
    finance,
  } = req.body;

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
        message:
          "The end year must be at least 12 months after the start year.",
      });
    }

    // Check if a council with the same startYear and endYear already exists
    const existingCouncil = await Council.findOne({
      startYear,
      endYear,
      localChurch,
    });

    if (existingCouncil) {
      return res.status(400).json({
        success: false,
        message:
          "A council with the same startYear and endYear already exists.",
      });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "councilId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom id
    const customId = `CLC-${counter?.seq.toString().padStart(4, "0")}`;

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
    const members = await Membership.find({ _id: { $in: uniqueMemberIds } });

    // Check if any member is missing
    if (members.length !== uniqueMemberIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more members do not exist in the Membership collection.",
      });
    }

    // Ensure that all members belong to the same local church
    const allMembersBelongToSameChurch = members.every(
      (member) => member.localChurch.toString() === localChurch
    );

    if (!allMembersBelongToSameChurch) {
      return res.status(400).json({
        success: false,
        message: "All members must belong to the same local church.",
      });
    }

    // Create and save the council if validation passes
    const council = new Council({ ...req.body, customId });
    const newCouncil = await council.save();

    res.status(201).json(newCouncil);
  } catch (err) {
    handleError(res, err, "An error occurred while creating council");
  }
};

// Get council by id
export const getCouncilById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const council = await Council.findById(id)
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
  } catch (err) {
    handleError(res, err, "An error occurred while getting council");
  }
};

// Update local church by id
export const updateCouncil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      startYear,
      endYear,
      administrativeOffice,
      localChurch,
      nurture,
      outreach,
      witness,
      churchHistorian,
      communications,
      finance,
    } = req.body;

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
        message:
          "The end year must be at least 12 months after the start year.",
      });
    }

    // Check if a council with the same startYear, endYear, and localChurch already exists (excluding the current one)
    const existingCouncil = await Council.findOne({
      _id: { $ne: id }, // Exclude the current council being updated
      startYear,
      endYear,
      localChurch,
    });

    if (existingCouncil) {
      return res.status(400).json({
        success: false,
        message:
          "A council with the same startYear, endYear, and localChurch already exists.",
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
    const members = await Membership.find({ _id: { $in: uniqueMemberIds } });

    // Check if any member is missing
    if (members.length !== uniqueMemberIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more members do not exist in the Membership collection.",
      });
    }

    // Ensure that all members belong to the same local church
    const allMembersBelongToSameChurch = members.every(
      (member) => member.localChurch.toString() === localChurch
    );

    if (!allMembersBelongToSameChurch) {
      return res.status(400).json({
        success: false,
        message: "All members must belong to the same local church.",
      });
    }

    // Update the council if validation passes
    const updateCouncil = await Council.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateCouncil) {
      return res.status(404).json({ message: "Council not found" });
    }

    res.status(200).json({ success: true, data: updateCouncil });
  } catch (err) {
    handleError(res, err, "An error occurred while updating council");
  }
};

// Delete council
export const deleteCouncil = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteCouncil = await Council.findByIdAndDelete(id);

    if (!deleteCouncil) {
      return res
        .status(404)
        .json({ success: false, message: "Council not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Council deleted successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting council");
  }
};
