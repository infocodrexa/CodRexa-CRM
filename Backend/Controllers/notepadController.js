import Note from "../Models/Notepad.js"; // Tumhara existing schema import

// =========================
// ✅ CREATE NOTE
// =========================
export const createNote = async (req, res) => {
  try {
    const newNote = new Note({
      ...req.body,
      user: req.user.id // Logged-in user ka ID
    });
    await newNote.save();
    res.status(201).json({ message: "✅ Note saved successfully!", note: newNote });
  } catch (error) {
    console.error("❌ Error saving note:", error);
    res.status(500).json({ message: "Error saving note", error });
  }
};

// =========================
// ✅ GET ALL NOTES FOR LOGGED-IN USER
// =========================
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ pinned: -1, priority: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// =========================
// ✅ GET SINGLE NOTE BY ID (ONLY OWNER)
// =========================
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "❌ Not authorized to view this note" });

    res.json(note);
  } catch (error) {
    console.error("❌ Error fetching note:", error);
    res.status(500).json({ message: "Error fetching note", error });
  }
};

// =========================
// ✅ UPDATE NOTE (ONLY OWNER)
// =========================
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "❌ Not authorized to update this note" });

    Object.assign(note, req.body, { updatedAt: Date.now() });
    await note.save();
    res.json({ message: "✅ Note updated!", note });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error });
  }
};

// =========================
// ✅ DELETE NOTE (ONLY OWNER)
// =========================
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(403).json({ message: "❌ Not authorized to delete this note" });

    await note.remove();
    res.json({ message: "✅ Note deleted!" });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error });
  }
};
