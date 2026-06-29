import mongoose, { Schema, model, models } from "mongoose";

const activityLogSchema = new Schema(
  {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update_title",
        "update_content",
        "update_note",
        "share",
        "update_collaborator",
        "remove_collaborator",
        "delete",
      ],
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