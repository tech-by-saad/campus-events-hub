
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/events
export const getEvents = asyncHandler(async (req, res) => {
  const { category, search, free, tag } = req.query;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (free === "true") {
    filter.entryFee = 0;
    filter.seatsAvailable = { $gt: 50 };
  }

if (tag) {
  filter.tags = {
    $in: tag.split(",").map((item) => item.trim())
  };
}

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i"
    };
  }

  const events = await Event.find(filter).sort({ date: 1 });

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// GET /api/events/:id
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json({ success: true, data: event });
});

// POST /api/events
export const createEvent = asyncHandler(async (req, res) => {
  const eventData = {
    ...req.body,
    _id: req.body._id || `EVT${Date.now()}`,
    seatsAvailable: req.body.capacity
  };

  const event = await Event.create(eventData);

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event
  });
});

// PUT /api/events/:id
export const updateEvent = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  // Event ID must not be changed.
  delete updates._id;

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json({
    success: true,
    message: "Event updated successfully",
    data: event
  });
});

// DELETE /api/events/:id
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const registrations = await Registration.exists({
    eventId: event._id
  });

  if (registrations) {
    res.status(409);
    throw new Error(
      "Cannot delete an event that has registrations"
    );
  }

  await event.deleteOne();

  res.json({
    success: true,
    message: "Event deleted successfully"
  });
});

// POST /api/events/:id/sponsors
export const addSponsor = asyncHandler(async (req, res) => {
  const { sponsor } = req.body;

  if (!sponsor || !sponsor.trim()) {
    res.status(400);
    throw new Error("Sponsor name is required");
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { sponsors: sponsor.trim() } },
    { new: true }
  );

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json({
    success: true,
    message: "Sponsor added successfully",
    data: event
  });
});
