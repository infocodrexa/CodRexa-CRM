import React, { useEffect, useState } from "react";
import API from "../utils/api.js";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/notes", { title, content });
      setTitle(""); setContent("");
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h3>Notes</h3>
      <form onSubmit={handleAdd} className="card p-3 mb-3">
        <input className="form-control mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="form-control mb-2" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
        <button className="btn btn-primary">Add Note</button>
      </form>

      <div className="list-group">
        {notes.map(n => (
          <div key={n._id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-bold">{n.title}</div>
              <div className="text-muted">{n.content}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
