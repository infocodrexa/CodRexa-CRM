import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // har note ka owner
  title: { type: String, required: true },
  content: { type: String, default: "" },
  start: { type: Date },
  end: { type: Date },
  tags: [{ type: String }],
  pinned: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  color: { type: String, default: "#ffffff" },
  priority: { type: String, enum: ["low","medium","high"], default: "low" },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


// Pre-save middleware to update updatedAt automatically
noteSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const Note = mongoose.model("notepad", noteSchema);
export default Note;
