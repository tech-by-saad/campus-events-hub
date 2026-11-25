
import express from "express";

import {
  getClubs,
  createClub,
  updateClub,
  deleteClub
} from "../controllers/clubController.js";

const router = express.Router();

router.get("/", getClubs);
router.post("/", createClub);
router.put("/:id", updateClub);
router.delete("/:id", deleteClub);

export default router;
