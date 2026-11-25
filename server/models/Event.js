
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true
    },

    organizerClub: {
      type: String,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    seatsAvailable: {
      type: Number,
      required: true,
      min: 0
    },

    entryFee: {
      type: Number,
      default: 0,
      min: 0
    },

    tags: [{
      type: String
    }],

    coordinators: [{
      name: String,
      contact: String
    }],

    sponsors: [{
      type: String
    }],

    image: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "events"
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
