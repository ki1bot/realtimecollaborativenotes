import express from "express";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  removeCollaborator,
  getActivities,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotes).post(protect, createNote);
router
  .route("/:id")
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);
router.post("/:id/collaborators", protect, addCollaborator);
router.delete("/:id/collaborators/:userId", protect, removeCollaborator);
router.get("/:id/activities", protect, getActivities);

export default router;
