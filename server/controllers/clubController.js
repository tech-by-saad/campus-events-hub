
import Club from "../models/Club.js";
import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/clubs
export const getClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find().sort({ name: 1 });

  res.json({
    success: true,
    count: clubs.length,
    data: clubs
  });
});

// POST /api/clubs
export const createClub = asyncHandler(async (req, res) => {
  const club = await Club.create(req.body);

  res.status(201).json({
    success: true,
    message: "Club created successfully",
    data: club
  });
});

// PUT /api/clubs/:id
export const updateClub = asyncHandler(async (req, res) => {
  const club = await Club.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  res.json({ success: true, data: club });
});

// DELETE /api/clubs/:id
export const deleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);

  if (!club) {
    res.status(404);
    throw new Error("Club not found");
  }

  const event = await Event.exists({
    organizerClub: club.name
  });

  if (event) {
    res.status(409);
    throw new Error(
      "Cannot delete a club that organizes events"
    );
  }

  await club.deleteOne();

  res.json({
    success: true,
    message: "Club deleted successfully"
  });
});
