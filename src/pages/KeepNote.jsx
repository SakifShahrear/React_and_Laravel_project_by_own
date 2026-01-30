import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "../css/KeepNote.css";

function KeepNote() {

  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state; // from profile

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, hour: '2-digit', minute: '2-digit' 
  });

  // Load edit data
  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setText(editData.text);
    }
  }, [editData]);

  const handleSave = async () => {

    if (!title || !text) {
      alert("Title and Note required!");
      return;
    }

    try {
      if (editData) {
        // UPDATE
        await api.put(`/notes/${editData.id}`, {
          title, text, date: currentDate, time: currentTime
        });
      } else {
        // CREATE
        await api.post('/notes', {
          title, text, date: currentDate, time: currentTime
        });
      }
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to save note");
    }
  };

  return (
    <div className="keepnote-screen">

      <div className="keepnote-card">

        <h1 className="keepnote-title">
          {editData ? "Edit Note" : "Create Note"}
        </h1>

        <p className="datetime">{currentDate} | {currentTime}</p>

        <input
          type="text"
          placeholder="Note Title"
          className="note-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note here..."
          className="note-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button className="save-btn" onClick={handleSave}>
          {editData ? "Update Note" : "Save Note"}
        </button>

      </div>

    </div>
  );
}

export default KeepNote;
