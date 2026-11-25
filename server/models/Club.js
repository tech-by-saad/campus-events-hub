
import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "General"
    },

    president: {
      type: String,
      default: ""
    },

    contactEmail: {
      type: String,
      lowercase: true,
      trim: true
    },

    members: {
      type: Number,
      default: 0,
      min: 0
    },

    logo: {
      type: String,
      default: ""
    }
  },
  { timestamps: true, collection: "clubs" }
);

const Club = mongoose.model("Club", clubSchema);

export default Club;
