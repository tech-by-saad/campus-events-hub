
import express from "express";

import {
  createRegistration,
  getRegistrations,
  getRegistrationByTicket,
  checkInStudent,
  getRevenueAnalytics,
  getDepartmentAnalytics,
  getTurnoutAnalytics
} from "../controllers/registrationController.js";

const router = express.Router();

// Analytics
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/analytics/departments", getDepartmentAnalytics);
router.get("/analytics/turnout", getTurnoutAnalytics);

// Registrations
router.post("/", createRegistration);
router.get("/", getRegistrations);
router.get("/:ticketId", getRegistrationByTicket);
router.patch("/:ticketId/check-in", checkInStudent);

export default router;
