import mongoose, { Schema, model, models } from "mongoose";

const activityLogSchema = new Schema(
  {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

activityLogSchema.index({ note: 1, createdAt: -1 });

export default models.ActivityLog || model("ActivityLog", activityLogSchema);
