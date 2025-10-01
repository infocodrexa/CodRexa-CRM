// import React, { useEffect, useState } from "react";
// import API, { fetchNotesAPI, createNoteAPI } from "../utils/api.js";
// import { Button, Card, Modal } from "react-bootstrap";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTrash, FaEdit, FaThumbtack } from "react-icons/fa";
// import { IoArchive } from "react-icons/io5";

// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // REUSABLE COMPONENTS AND HELPERS (DEFINED IN THE SAME FILE)
// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// // Stylish Popup/Toast Component
// const ToastPopup = ({ message }) => (
//   <motion.div
//     initial={{ y: 100, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     exit={{ y: 100, opacity: 0 }}
//     style={{
//       position: "fixed",
//       bottom: "20px",
//       left: "50%",
//       transform: "translateX(-50%)",
//       backgroundColor: "#333",
//       color: "white",
//       padding: "10px 20px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//       zIndex: 1056,
//     }}
//   >
//     {message}
//   </motion.div>
// );

// // Component for Note Action Icons
// const NoteActions = ({
//   note,
//   onTogglePin,
//   onToggleArchive,
//   onEdit,
//   onDelete,
// }) => (
//   <div
//     className="card-actions"
//     style={{
//       position: "absolute",
//       bottom: "-40px",
//       left: 0,
//       width: "100%",
//       display: "flex",
//       justifyContent: "space-around",
//       padding: "5px",
//       backgroundColor: "rgba(0,0,0,0.6)",
//       color: "#fff",
//       transition: "bottom 0.3s",
//     }}
//   >
//     <FaThumbtack
//       style={{ cursor: "pointer" }}
//       title={note.pinned ? "Unpin" : "Pin"}
//       onClick={() => onTogglePin(note)}
//     />
//     <IoArchive
//       style={{ cursor: "pointer" }}
//       title={note.archived ? "Unarchive" : "Archive"}
//       onClick={() => onToggleArchive(note)}
//     />
//     <FaEdit
//       style={{ cursor: "pointer" }}
//       title="Edit"
//       onClick={() => onEdit(note)}
//     />
//     <FaTrash
//       style={{ cursor: "pointer" }}
//       title="Delete"
//       onClick={() => onDelete(note._id)}
//     />
//   </div>
// );

// // Component for Add/Edit Note Form
// const NoteForm = ({ note, setNote, showToast, isEdit = false }) => {
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "title" && value.length > 50) {
//       showToast("Title cannot exceed 50 characters.");
//       return;
//     }

//     setNote((prevNote) => ({
//       ...prevNote,
//       [name]: value,
//     }));
//   };

//   return (
//     <>
//       <div className="mb-3">
//         <label className="form-label">Title</label>
//         <input
//           type="text"
//           name="title"
//           className="form-control"
//           value={note.title}
//           onChange={handleChange}
//           required
//         />
//         <small className="form-text text-muted text-end d-block">
//           {note.title.length} / 50
//         </small>
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Content</label>
//         <textarea
//           name="content"
//           className="form-control"
//           rows={isEdit ? 3 : 5}
//           value={note.content}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Priority</label>
//         <select
//           name="priority"
//           className="form-select"
//           value={note.priority}
//           onChange={handleChange}
//         >
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//         </select>
//       </div>
//       <div className="mb-3">
//         <label className="form-label">Color</label>
//         <input
//           type="color"
//           name="color"
//           className="form-control form-control-color"
//           value={note.color}
//           onChange={handleChange}
//         />
//       </div>
//     </>
//   );
// };

// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // MAIN NOTES PAGE COMPONENT
// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editNote, setEditNote] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showArchived, setShowArchived] = useState(false);
//   const [expandedNote, setExpandedNote] = useState(null);
//   const [toast, setToast] = useState({ show: false, message: "" });
//   const [newNote, setNewNote] = useState({
//     title: "",
//     content: "",
//     tags: [],
//     color: "#ffffff",
//     priority: "low",
//   });

//   const showToast = (message) => {
//     setToast({ show: true, message });
//     setTimeout(() => {
//       setToast({ show: false, message: "" });
//     }, 3000);
//   };

//   useEffect(() => {
//     const fetchNotes = async () => {
//       try {
//         const data = await fetchNotesAPI();
//         setNotes(data);
//       } catch (err) {
//         console.error("Error fetching notes:", err);
//       }
//     };
//     fetchNotes();
//   }, []);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await createNoteAPI(newNote);
//       // ensure color always preserved
//       setNotes([...notes, { ...res.note, color: newNote.color }]);
//       setNewNote({
//         title: "",
//         content: "",
//         tags: [],
//         color: "#ffffff",
//         priority: "low",
//       });
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Error creating note:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/notes/${id}`);
//       setNotes(notes.filter((note) => note._id !== id));
//       if (expandedNote && expandedNote._id === id) setExpandedNote(null);
//       if (editNote && editNote._id === id) setShowModal(false);
//     } catch (err) {
//       console.error("Error deleting note:", err);
//     }
//   };

//   const handleTogglePin = async (note) => {
//     try {
//       const res = await API.put(`/notes/${note._id}`, { pinned: !note.pinned });
//       const updatedNote = res.data.note;
//       setNotes(notes.map((n) => (n._id === note._id ? updatedNote : n)));
//       if (expandedNote && expandedNote._id === note._id)
//         setExpandedNote(updatedNote);
//     } catch (err) {
//       console.error("Error pinning note:", err);
//     }
//   };

//   const handleToggleArchive = async (note) => {
//     try {
//       const res = await API.put(`/notes/${note._id}`, {
//         archived: !note.archived,
//       });
//       const updatedNote = res.data.note;
//       setNotes(notes.map((n) => (n._id === note._id ? updatedNote : n)));
//       if (expandedNote && expandedNote._id === note._id) setExpandedNote(null);
//     } catch (err) {
//       console.error("Error archiving note:", err);
//     }
//   };

//   const handleEdit = (note) => {
//     setEditNote(note);
//     setShowModal(true);
//     if (expandedNote) setExpandedNote(null);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const res = await API.put(`/notes/${editNote._id}`, editNote);
//       // ensure color always preserved
//       setNotes(
//         notes.map((n) =>
//           n._id === editNote._id
//             ? { ...res.data.note, color: editNote.color }
//             : n
//         )
//       );
//       setShowModal(false);
//       setEditNote(null);
//     } catch (err) {
//       console.error("Error updating note:", err);
//     }
//   };

//   const sortNotes = (list) =>
//     [...list].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

//   const getTextColor = (bgColor) => {
//     return bgColor.toLowerCase() === "#ffffff" ? "#111010ff" : "#ffffff";
//   };

//   const getPriorityColor = (priority) => {
//     if (priority === "high") return "#dc3545";
//     if (priority === "medium") return "#b88d0dff";
//     return "#236446ff";
//   };

//   const truncateTitle = (title) => {
//     const words = title.split(" ");
//     if (words.length > 5) {
//       return words.slice(0, 5).join(" ") + "...";
//     }
//     return title;
//   };

//   const filteredNotes = sortNotes(
//     notes.filter((note) => (showArchived ? note.archived : !note.archived))
//   );

//   return (
//     <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
//       <AnimatePresence>
//         {toast.show && <ToastPopup message={toast.message} />}
//       </AnimatePresence>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px",
//           flexWrap: "wrap",
//         }}
//       >
//         <h2 style={{ marginBottom: "10px" }}>My Notes</h2>
//         <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//           <Button
//             variant={showArchived ? "secondary" : "outline-secondary"}
//             onClick={() => setShowArchived(!showArchived)}
//           >
//             {showArchived ? "Hide Archived" : "Archived Notes"}
//           </Button>
//           <Button variant="primary" onClick={() => setShowAddModal(true)}>
//             <i className="fa-solid fa-plus"></i>
//           </Button>
//         </div>
//       </div>

//       {/* Notes Grid */}
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "20px",
//           justifyContent: "flex-start",
//         }}
//       >
//         <AnimatePresence>
//           {filteredNotes.map((note) => (
//             <motion.div
//               key={note._id}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ duration: 0.3 }}
//               style={{ width: "200px", cursor: "pointer" }}
//             >
//               <Card
//                 className="shadow-sm text-wrap"
//                 style={{
//                   backgroundColor: note.color,
//                   minHeight: "150px",
//                   width: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.querySelector(".card-actions").style.bottom =
//                     "0px")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.querySelector(".card-actions").style.bottom =
//                     "-40px")
//                 }
//               >
//                 <Card.Body
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "space-between",
//                     color: getTextColor(note.color),
//                   }}
//                   onClick={() => setExpandedNote(note)}
//                 >
//                   <div>
//                     <Card.Title
//                       style={{
//                         fontWeight: "bold",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <span>{truncateTitle(note.title)}</span>
//                       {note.pinned && (
//                         <span
//                           style={{
//                             backgroundColor: "#3a3f3d5d",
//                             padding: "2px 6px",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           📌
//                         </span>
//                       )}
//                     </Card.Title>
//                     <Card.Text
//                       style={{ fontSize: "0.875rem", marginBottom: "8px" }}
//                     >
//                       {note.content.length > 80
//                         ? note.content.slice(0, 80) + "..."
//                         : note.content}
//                     </Card.Text>
//                   </div>
//                   <span
//                     style={{
//                       padding: "2px 6px",
//                       borderRadius: "4px",
//                       backgroundColor: getPriorityColor(note.priority),
//                       color: "#fff",
//                       fontSize: "0.75rem",
//                       alignSelf: "flex-start",
//                     }}
//                   >
//                     {note.priority}
//                   </span>
//                 </Card.Body>
//                 <NoteActions
//                   note={note}
//                   onTogglePin={handleTogglePin}
//                   onToggleArchive={handleToggleArchive}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                 />
//               </Card>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {/* Expanded Note Modal */}
//       <Modal
//         show={!!expandedNote}
//         onHide={() => setExpandedNote(null)}
//         centered
//         size="md"
//       >
//         {expandedNote && (
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: 50, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Modal.Header closeButton>
//               <Modal.Title style={{ color: "#000000" }}>
//                 {expandedNote.title}
//               </Modal.Title>
//             </Modal.Header>
//             <Modal.Body
//               style={{ maxHeight: "55vh", overflowY: "auto", color: "#000000" }}
//             >
//               <p>{expandedNote.content}</p>
//             </Modal.Body>
//             <Modal.Footer
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 flexWrap: "nowrap",
//                 gap: "10px",
//               }}
//             >
//               <Button variant="dark" onClick={() => setExpandedNote(null)}>
//                 Close
//               </Button>
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "10px",
//                   alignItems: "center",
//                   flexWrap: "nowrap",
//                 }}
//               >
//                 <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>
//                   Created:{" "}
//                   {new Date(expandedNote.createdAt).toLocaleDateString()}
//                 </span>
//                 <FaThumbtack
//                   style={{ cursor: "pointer" }}
//                   title={expandedNote.pinned ? "Unpin" : "Pin"}
//                   onClick={() => handleTogglePin(expandedNote)}
//                   color={expandedNote.pinned ? "red" : "black"}
//                 />
//                 <IoArchive
//                   style={{ cursor: "pointer" }}
//                   title={expandedNote.archived ? "Unarchive" : "Archive"}
//                   onClick={() => handleToggleArchive(expandedNote)}
//                   color={expandedNote.archived ? "red" : "black"}
//                 />
//                 <FaEdit
//                   style={{ cursor: "pointer" }}
//                   title="Edit"
//                   onClick={() => handleEdit(expandedNote)}
//                 />
//                 <FaTrash
//                   style={{ cursor: "pointer" }}
//                   title="Delete"
//                   onClick={() => handleDelete(expandedNote._id)}
//                 />
//               </div>
//             </Modal.Footer>
//           </motion.div>
//         )}
//       </Modal>

//       {/* Add Note Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Note</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form onSubmit={handleCreate}>
//             <NoteForm
//               note={newNote}
//               setNote={setNewNote}
//               showToast={showToast}
//             />
//             <div
//               style={{
//                 display: "flex",
//                 gap: "10px",
//                 flexWrap: "wrap",
//                 marginTop: "1rem",
//               }}
//             >
//               <Button variant="dark" onClick={() => setShowAddModal(false)}>
//                 Close
//               </Button>
//               <Button variant="primary" type="submit">
//                 Add Note
//               </Button>
//             </div>
//           </form>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Note Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Note</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editNote && (
//             <NoteForm
//               note={editNote}
//               setNote={setEditNote}
//               isEdit={true}
//               showToast={showToast}
//             />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="dark" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSaveEdit}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import API, { fetchNotesAPI, createNoteAPI } from "../utils/api.js";
import { Button, Card, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaThumbtack } from "react-icons/fa";
import { IoArchive } from "react-icons/io5";

// ... (Baaki ke components jaise ToastPopup, NoteActions, NoteForm waise hi rahenge) ...
// Stylish Popup/Toast Component
const ToastPopup = ({ message }) => (
    <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1056,
        }}
    >
        {message}
    </motion.div>
);

// Component for Note Action Icons
const NoteActions = ({ note, onTogglePin, onToggleArchive, onEdit, onDelete }) => (
    <div
        className="card-actions"
        style={{
            position: "absolute",
            bottom: "-40px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            padding: "5px",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            transition: "bottom 0.3s",
        }}
    >
        <FaThumbtack style={{ cursor: "pointer" }} title={note.pinned ? "Unpin" : "Pin"} onClick={() => onTogglePin(note)} />
        <IoArchive style={{ cursor: "pointer" }} title={note.archived ? "Unarchive" : "Archive"} onClick={() => onToggleArchive(note)} />
        <FaEdit style={{ cursor: "pointer" }} title="Edit" onClick={() => onEdit(note)} />
        <FaTrash style={{ cursor: "pointer" }} title="Delete" onClick={() => onDelete(note._id)} />
    </div>
);

// Component for Add/Edit Note Form
const NoteForm = ({ note, setNote, showToast, isEdit = false }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'title' && value.length > 50) {
            showToast("Title cannot exceed 50 characters.");
            return;
        }

        setNote(prevNote => ({
            ...prevNote,
            [name]: value
        }));
    };

    return (
        <>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={note.title}
                    onChange={handleChange}
                    required
                />
                <small className="form-text text-muted text-end d-block">
                    {note.title.length} / 50
                </small>
            </div>
            <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                    name="content"
                    className="form-control"
                    rows={isEdit ? 3 : 5}
                    value={note.content}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Priority</label>
                <select
                    name="priority"
                    className="form-select"
                    value={note.priority}
                    onChange={handleChange}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Color</label>
                <input
                    type="color"
                    name="color"
                    className="form-control form-control-color"
                    value={note.color}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// MAIN NOTES PAGE COMPONENT (WITH CHANGES)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [expandedNote, setExpandedNote] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        tags: [],
        color: "#ffffff",
        priority: "low",
    });

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await fetchNotesAPI();
                setNotes(data);
            } catch (err) {
                console.error("Error fetching notes:", err);
            }
        };
        fetchNotes();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await createNoteAPI(newNote);
            setNotes([...notes, { ...res.note, color: newNote.color }]);
            setNewNote({ title: "", content: "", tags: [], color: "#ffffff", priority: "low" });
            setShowAddModal(false);
            showToast("Note added successfully! ✅"); // <-- ADDED
        } catch (err) {
            console.error("Error creating note:", err);
            showToast("Failed to add note. ❌");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id));
            if (expandedNote && expandedNote._id === id) setExpandedNote(null);
            if(editNote && editNote._id === id) setShowModal(false);
            showToast("Note deleted successfully! 🗑️"); // <-- ADDED
        } catch (err) {
            console.error("Error deleting note:", err);
            showToast("Failed to delete note. ❌");
        }
    };

    const handleTogglePin = async (note) => {
        try {
            const res = await API.put(`/notes/${note._id}`, { pinned: !note.pinned });
            const updatedNote = res.data.note;
            setNotes(notes.map((n) => (n._id === note._id ? updatedNote : n)));
            if (expandedNote && expandedNote._id === note._id) setExpandedNote(updatedNote);
            showToast(updatedNote.pinned ? "Note pinned! 📌" : "Note unpinned!"); // <-- ADDED
        } catch (err) {
            console.error("Error pinning note:", err);
            showToast("Action failed. ❌");
        }
    };

    const handleToggleArchive = async (note) => {
        try {
            const res = await API.put(`/notes/${note._id}`, { archived: !note.archived });
            const updatedNote = res.data.note;
            setNotes(notes.map((n) => (n._id === note._id ? updatedNote : n)));
             if (expandedNote && expandedNote._id === note._id) setExpandedNote(null);
             showToast(updatedNote.archived ? "Note archived! 📦" : "Note unarchived!"); // <-- ADDED
        } catch (err) {
            console.error("Error archiving note:", err);
            showToast("Action failed. ❌");
        }
    };

    const handleEdit = (note) => {
        setEditNote(note);
        setShowModal(true);
        if(expandedNote) setExpandedNote(null);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await API.put(`/notes/${editNote._id}`, editNote);
            setNotes(notes.map((n) =>
              n._id === editNote._id ? { ...res.data.note, color: editNote.color } : n
            ));
            setShowModal(false);
            setEditNote(null);
            showToast("Note updated successfully! ✨"); // <-- ADDED
        } catch (err) {
            console.error("Error updating note:", err);
            showToast("Failed to update note. ❌");
        }
    };

    // ... (Baaki ka component code jaise sortNotes, getTextColor, return JSX waise hi rahega) ...
    const sortNotes = (list) => [...list].sort((a, b) => a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1);

    const getTextColor = (bgColor) => {
      return bgColor.toLowerCase() === "#ffffff" ? "#111010ff" : "#ffffff";
    };

    const getPriorityColor = (priority) => {
        if (priority === "high") return "#dc3545";
        if (priority === "medium") return "#b88d0dff";
        return "#236446ff";
    };

    const truncateTitle = (title) => {
        const words = title.split(' ');
        if (words.length > 5) {
            return words.slice(0, 5).join(' ') + '...';
        }
        return title;
    };

    const filteredNotes = sortNotes(notes.filter((note) => showArchived ? note.archived : !note.archived));

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
             <AnimatePresence>
                {toast.show && <ToastPopup message={toast.message} />}
            </AnimatePresence>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
                <h2 style={{ marginBottom: "10px" }}>My Notes</h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <Button variant={showArchived ? "secondary" : "outline-secondary"} onClick={() => setShowArchived(!showArchived)}>
                        {showArchived ? "Hide Archived" : "Archived Notes"}
                    </Button>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <i className="fa-solid fa-plus"></i>
                    </Button>
                </div>
            </div>

            {/* Notes Grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "flex-start" }}>
                <AnimatePresence>
                    {filteredNotes.map((note) => (
                        <motion.div
                            key={note._id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: "200px", cursor: "pointer" }}>
                            <Card
                                className="shadow-sm text-wrap"
                                style={{
                                    backgroundColor: note.color,
                                    minHeight: "150px",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.querySelector(".card-actions").style.bottom = "0px")}
                                onMouseLeave={(e) => (e.currentTarget.querySelector(".card-actions").style.bottom = "-40px")}
                            >
                                <Card.Body
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        color: getTextColor(note.color),
                                    }}
                                    onClick={() => setExpandedNote(note)}
                                >
                                    <div>
                                        <Card.Title style={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span>{truncateTitle(note.title)}</span>
                                            {note.pinned && <span style={{ backgroundColor: "#3a3f3d5d", padding: "2px 6px", borderRadius: "4px" }}>📌</span>}
                                        </Card.Title>
                                        <Card.Text style={{ fontSize: "0.875rem",marginBottom:"8px",   }}>
                                            {note.content.length > 80 ? note.content.slice(0, 80) + "..." : note.content}
                                        </Card.Text>
                                    </div>
                                    <span style={{ padding: "2px 6px", borderRadius: "4px",         backgroundColor: getPriorityColor(note.priority), color: "#fff", fontSize: "0.75rem", alignSelf: 'flex-start' }}>
                                        {note.priority}
                                    </span>
                                </Card.Body>
                                <NoteActions note={note} onTogglePin={handleTogglePin} onToggleArchive={handleToggleArchive} onEdit={handleEdit} onDelete={handleDelete} />
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Expanded Note Modal */}
            <Modal show={!!expandedNote} onHide={() => setExpandedNote(null)} centered size="md">
                {expandedNote && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ color: "#000000" }}>{expandedNote.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: "55vh", overflowY: "auto", color: "#000000" }}>
                            <p>{expandedNote.content}</p>
                        </Modal.Body>
                        <Modal.Footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "10px" }}>
                            <Button variant="dark" onClick={() => setExpandedNote(null)}>Close</Button>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "nowrap" }}>
                                <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Created: {new Date(expandedNote.createdAt).toLocaleDateString()}</span>
                                <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Updated: {new Date(expandedNote.updatedAt).toLocaleDateString()}</span>
                                <FaThumbtack style={{ cursor: "pointer" }} title={expandedNote.pinned ? "Unpin" : "Pin"} onClick={() => handleTogglePin(expandedNote)} color={expandedNote.pinned ? "red" : "black"} />
                                <IoArchive style={{ cursor: "pointer" }} title={expandedNote.archived ? "Unarchive" : "Archive"} onClick={() => handleToggleArchive(expandedNote)} color={expandedNote.archived ? "red" : "black"}/>
                                <FaEdit style={{ cursor: "pointer" }} title="Edit" onClick={() => handleEdit(expandedNote)} />
                                <FaTrash style={{ cursor: "pointer" }} title="Delete" onClick={() => handleDelete(expandedNote._id)} />
                            </div>
                        </Modal.Footer>
                    </motion.div>
                )}
            </Modal>

            {/* Add Note Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleCreate}>
                        <NoteForm note={newNote} setNote={setNewNote} showToast={showToast}/>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                            <Button variant="dark" onClick={() => setShowAddModal(false)}>Close</Button>
                            <Button variant="primary" type="submit">Add Note</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Edit Note Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editNote && <NoteForm note={editNote} setNote={setEditNote} isEdit={true} showToast={showToast} />}
                </Modal.Body>
                <Modal.Footer>
                     <Button variant="dark" onClick={() => setShowModal(false)}>Close</Button>
                     <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}