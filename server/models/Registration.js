
import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true
    },

    eventId: {
      type: String,
      required: true,
      index: true
    },

    studentId: {
      type: String,
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    registrationDate: {
      type: Date,
      default: Date.now
    },

    checkInStatus: {
      type: Boolean,
      default: false
    },

    paymentDetails: {
      method: {
        type: String,
        default: "Free"
      },

      amountPaid: {
        type: Number,
        default: 0
      },

      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
      }
    }
  },
  {
    timestamps: true,
    collection: "registrations"
  }
);

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

export default Registration;
