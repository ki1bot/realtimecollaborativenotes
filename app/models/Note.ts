import mongoose, { Schema, model, models } from "mongoose";

const collaboratorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      default: "viewer",
    },
  },
  {
    _id: false,
  },
);

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Note",
      maxlength: 120,
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ owner: 1 });
noteSchema.index({ "collaborators.user": 1 });

export default models.Note || model("Note", noteSchema);
