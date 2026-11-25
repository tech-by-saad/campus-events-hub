
import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addSponsor
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/sponsors", addSponsor);

export default router;
