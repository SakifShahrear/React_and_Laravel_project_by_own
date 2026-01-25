import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";
import profileImg from "../css/boy.png";

function Profile() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // new
  const notesPerPage = 5;

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const reversedNotes = savedNotes.reverse(); // newest first
    setNotes(reversedNotes);
  }, []);

  // Search filter
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.date.includes(searchQuery)
  );

  // Pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  // Navigate to KeepNote page
  const goToKeepNote = () => navigate("/keepnote");

  const editNote = (note, index) => {
    navigate("/keepnote", { state: { ...note, index } });
  };

  const deleteNote = (index) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify([...updatedNotes].reverse()));
    }
  };

  return (
    <div className="profile-screen">
      {/* Profile Card */}
      <div className="profile-top">
        <div className="profile-info">
          <h1 className="profile-name">Mr AB</h1>
          <p className="profile-text">📧 example@gmail.com</p>
          <p className="profile-text">📞 017xxxxxxxx</p>
          <p className="profile-text">💼 Student</p>
        </div>
        <div>
          <img src={profileImg} alt="Profile" className="profile-img" />
        </div>
      </div>

      {/* Keep Notes Section */}
      <div className="keepnote-section">
        <div className="keepnote-header">
          <h2>My Notes</h2>
          <button className="add-note-btn" onClick={goToKeepNote}>
            + Add Note
          </button>
        </div>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or date..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset page
            }}
          />
        </div>

        {/* Notes Grid */}
        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="note-placeholder">No Notes Found</div>
          ) : (
            currentNotes.map((note, index) => (
              <div key={index} className="note-card">
                <h3>{note.title}</h3>
                <small>
                  {note.date} | {note.time}
                </small>
                <p>{note.text}</p>
                {note.image && <img src={note.image} alt="note" />}
                <div className="note-actions">
                  <button className="edit-btn" onClick={() => editNote(note, index)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteNote(index)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredNotes.length > notesPerPage && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
