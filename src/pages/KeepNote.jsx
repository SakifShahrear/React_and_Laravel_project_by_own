import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/KeepNote.css";

function KeepNote() {

  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state; // from profile

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Load edit data
  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setText(editData.text);
      setImage(editData.image);
    }
  }, [editData]);

  const handleSave = () => {

    if (!title || !text) {
      alert("Title and Note required!");
      return;
    }

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (editData) {

      // UPDATE MODE
      notes[editData.index] = {
        title,
        text,
        image,
        date: currentDate,
        time: currentTime
      };

    } else {

      // CREATE MODE
      notes.push({
        title,
        text,
        image,
        date: currentDate,
        time: currentTime
      });
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    navigate("/profile");
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(URL.createObjectURL(e.target.files[0]))
          }
        />

        {image && <img src={image} className="preview-img" alt="preview" />}

        <button className="save-btn" onClick={handleSave}>
          {editData ? "Update Note" : "Save Note"}
        </button>

      </div>

    </div>
  );
}

export default KeepNote;
