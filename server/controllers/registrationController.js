
import { randomBytes } from "node:crypto";

import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/registrations
export const createRegistration = asyncHandler(async (req, res) => {
  const {
    eventId,
    studentId,
    studentName,
    department,
    year,
    paymentMethod
  } = req.body;

  if (
    !eventId ||
    !studentId ||
    !studentName ||
    !department ||
    !Number.isInteger(Number(year))
  ) {
    res.status(400);
    throw new Error("Please provide all student details");
  }

  const existing = await Registration.findOne({
    eventId,
    studentId
  });

  if (existing) {
    res.status(409);
    throw new Error("You are already registered for this event");
  }

  // Atomic seat booking: only book if a seat is available.
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      seatsAvailable: { $gt: 0 }
    },
    {
      $inc: { seatsAvailable: -1 }
    },
    { new: true }
  );

  if (!event) {
    res.status(409);
    throw new Error("Event not found or no seats available");
  }

  const amount = event.entryFee;

  const registrationData = {
    ticketId: `TICK-${Date.now()}-${randomBytes(3).toString("hex")}`,
    eventId,
    studentId,
    studentName,
    department,
    year: Number(year),
    checkInStatus: false,
    paymentDetails: {
      method: amount === 0 ? "Free" : (paymentMethod || "UPI"),
      amountPaid: amount,
      status: "Completed"
    }
  };

  try {
    const registration = await Registration.create(registrationData);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration
    });
  } catch (error) {
    // Restore the seat if registration creation fails.
    await Event.updateOne(
      { _id: eventId },
      { $inc: { seatsAvailable: 1 } }
    );

    throw error;
  }
});

// GET /api/registrations
export const getRegistrations = asyncHandler(async (req, res) => {
  const { department, eventId, studentId } = req.query;

  const filter = {};

  if (department) filter.department = department;
  if (eventId) filter.eventId = eventId;
  if (studentId) filter.studentId = studentId;

  const registrations = await Registration.find(filter)
    .sort({ registrationDate: -1 });

  res.json({
    success: true,
    count: registrations.length,
    data: registrations
  });
});

// GET /api/registrations/:ticketId
export const getRegistrationByTicket = asyncHandler(
  async (req, res) => {
    const registration = await Registration.findOne({
      ticketId: req.params.ticketId
    });

    if (!registration) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    res.json({ success: true, data: registration });
  }
);

// PATCH /api/registrations/:ticketId/check-in
export const checkInStudent = asyncHandler(async (req, res) => {
  const registration = await Registration.findOneAndUpdate(
    {
      ticketId: req.params.ticketId,
      checkInStatus: false
    },
    {
      $set: { checkInStatus: true }
    },
    { new: true }
  );

  if (!registration) {
    const existing = await Registration.findOne({
      ticketId: req.params.ticketId
    });

    if (!existing) {
      res.status(404);
      throw new Error("Ticket not found");
    }

    res.status(409);
    throw new Error("Student is already checked in");
  }

  res.json({
    success: true,
    message: "Student checked in successfully",
    data: registration
  });
});

// GET /api/analytics/revenue
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const data = await Registration.aggregate([
    {
      $group: {
        _id: "$eventId",
        totalRevenue: {
          $sum: "$paymentDetails.amountPaid"
        },
        totalTicketsSold: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "eventInfo"
      }
    },
    { $unwind: "$eventInfo" },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventTitle: "$eventInfo.title",
        organizerClub: "$eventInfo.organizerClub",
        totalRevenue: 1,
        totalTicketsSold: 1
      }
    }
  ]);

  res.json({ success: true, data });
});

// GET /api/analytics/departments
export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const data = await Registration.aggregate([
    {
      $group: {
        _id: "$department",
        totalRegistrations: { $sum: 1 }
      }
    },
    { $sort: { totalRegistrations: -1 } }
  ]);

  res.json({ success: true, data });
});

// GET /api/analytics/turnout
export const getTurnoutAnalytics = asyncHandler(async (req, res) => {
  const data = await Registration.aggregate([
    {
      $group: {
        _id: "$eventId",
        totalRegistrations: { $sum: 1 },
        checkedInCount: {
          $sum: {
            $cond: [
              { $eq: ["$checkInStatus", true] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        totalRegistrations: 1,
        checkedInCount: 1,
        turnoutPercentage: {
          $cond: [
            { $gt: ["$totalRegistrations", 0] },
            {
              $multiply: [
                {
                  $divide: [
                    "$checkedInCount",
                    "$totalRegistrations"
                  ]
                },
                100
              ]
            },
            0
          ]
        }
      }
    }
  ]);

  res.json({ success: true, data });
});
