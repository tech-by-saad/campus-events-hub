
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Club from "./models/Club.js";
import Event from "./models/Event.js";
import Registration from "./models/Registration.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Clubs
    const clubs = [
      {
        name: "Coding Club",
        description: "A club for coding, programming and hackathons.",
        category: "Technical",
        president: "Aarav Sharma",
        contactEmail: "coding@college.edu",
      },
      {
        name: "Music Society",
        description: "A club for music and cultural events.",
        category: "Cultural",
        president: "Riya Sen",
        contactEmail: "music@college.edu",
      },
      {
        name: "Robotics Club",
        description: "A club focused on robotics, AI and technology.",
        category: "Technical",
        president: "Karan Patel",
        contactEmail: "robotics@college.edu",
      },
    ];

    for (const club of clubs) {
      await Club.updateOne(
        { name: club.name },
        { $setOnInsert: club },
        { upsert: true }
      );
    }

    // 2. Events
    const events = [
      {
        _id: "EVT101",
        title: "HackCampus 2026",
        description: "A campus hackathon with coding challenges and prizes.",
        category: "Technical",
        organizerClub: "Coding Club",
        venue: "Auditorium A",
        date: new Date("2027-02-15T09:00:00Z"),
        capacity: 200,
        seatsAvailable: 45,
        entryFee: 150,
        tags: ["hackathon", "coding", "prizes"],
        coordinators: [
          { name: "Aarav Sharma", contact: "aarav@college.edu" },
        ],
        sponsors: ["TechCorp", "DevStudio"],
      },
      {
        _id: "EVT102",
        title: "Annual Music Night",
        description: "An evening of music, performances and entertainment.",
        category: "Cultural",
        organizerClub: "Music Society",
        venue: "Open Air Theatre",
        date: new Date("2027-03-10T18:00:00Z"),
        capacity: 500,
        seatsAvailable: 120,
        entryFee: 0,
        tags: ["music", "concert", "night"],
        coordinators: [
          { name: "Riya Sen", contact: "riya@college.edu" },
        ],
        sponsors: [],
      },
      {
        _id: "EVT103",
        title: "AI & Robotics Workshop",
        description: "A practical workshop on AI and robotics.",
        category: "Technical",
        organizerClub: "Robotics Club",
        venue: "Lab 3",
        date: new Date("2027-04-05T10:00:00Z"),
        capacity: 60,
        seatsAvailable: 10,
        entryFee: 50,
        tags: ["ai", "robotics", "workshop"],
        coordinators: [
          { name: "Karan Patel", contact: "karan@college.edu" },
        ],
        sponsors: ["RoboLabs"],
      },
    ];

    for (const event of events) {
      await Event.updateOne(
        { _id: event._id },
        { $setOnInsert: event },
        { upsert: true }
      );
    }

    // 3. Registrations
    const registrations = [
      {
        ticketId: "TICK-2026-001",
        eventId: "EVT101",
        studentId: "STU8821",
        studentName: "Priya Verma",
        department: "Computer Science",
        year: 3,
        registrationDate: new Date("2026-09-12T14:30:00Z"),
        checkInStatus: false,
        paymentDetails: {
          method: "UPI",
          amountPaid: 150,
          status: "Completed",
        },
      },
      {
        ticketId: "TICK-2026-002",
        eventId: "EVT102",
        studentId: "STU8821",
        studentName: "Priya Verma",
        department: "Computer Science",
        year: 3,
        registrationDate: new Date("2026-09-13T10:00:00Z"),
        checkInStatus: true,
        paymentDetails: {
          method: "Free",
          amountPaid: 0,
          status: "Completed",
        },
      },
      {
        ticketId: "TICK-2026-003",
        eventId: "EVT101",
        studentId: "STU4412",
        studentName: "Rohan Gupta",
        department: "Electrical Engineering",
        year: 2,
        registrationDate: new Date("2026-09-14T11:20:00Z"),
        checkInStatus: true,
        paymentDetails: {
          method: "Card",
          amountPaid: 150,
          status: "Completed",
        },
      },
      {
        ticketId: "TICK-2026-004",
        eventId: "EVT103",
        studentId: "STU9903",
        studentName: "Ananya Roy",
        department: "Computer Science",
        year: 4,
        registrationDate: new Date("2026-09-15T16:45:00Z"),
        checkInStatus: false,
        paymentDetails: {
          method: "UPI",
          amountPaid: 50,
          status: "Completed",
        },
      },
    ];

    for (const registration of registrations) {
      await Registration.updateOne(
        { ticketId: registration.ticketId },
        { $setOnInsert: registration },
        { upsert: true }
      );
    }

    console.log("Database seeding completed!");
    console.log("3 clubs, 3 events and 4 registrations are ready.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
