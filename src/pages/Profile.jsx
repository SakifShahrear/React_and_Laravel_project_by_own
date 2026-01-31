// Import necessary hooks and utilities
// প্রয়োজনীয় হুক এবং ইউটিলিটি ইম্পোর্ট করা
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Importing api instance
import defaultImage from "../assets/boy.png";
import "../css/Profile.css";

export default function Profile() {
  // Initialize navigation hook
  // নেভিগেশন হুক শুরু করা
  const navigate = useNavigate();

  // State to store user profile data from API
  // API থেকে ইউজার প্রোফাইল ডেটা সংরক্ষণের জন্য স্টেট
  const [user, setUser] = useState(null);

  // State to manage notes list
  // নোট লিস্ট ম্যানেজ করার জন্য স্টেট
  const [notes, setNotes] = useState([]);

  // Pagination state
  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);

  // Search query state
  // সার্চ কোয়েরি স্টেট
  const [searchQuery, setSearchQuery] = useState("");

  // Number of notes to display per page
  // প্রতি পেজে কতগুলো নোট দেখাবে
  const notesPerPage = 5;

  // Fetch user profile data from API on component mount
  // কম্পোনেন্ট মাউন্ট হলে API থেকে ইউজার প্রোফাইল ডেটা আনা
  useEffect(() => {
    console.log('🔍 Fetching profile...');
    api.get("/api/user")
      .then((res) => {
        console.log('✅ Profile response:', res);
        console.log('✅ Profile data:', res.data);
        
        // Check if data is nested (e.g., res.data.user or res.data.client)
        const userData = res.data.user || res.data.client || res.data;
        console.log('✅ Setting user:', userData);
        setUser(userData);
      })
      .catch((err) => {
        console.error('❌ Profile fetch error:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error data:', err.response?.data);
        
        // If 401, redirect to login
        if (err.response?.status === 401) {
          alert('Session expired. Please login again.');
          navigate('/login');
        }
      });
  }, [navigate]);

  // Load notes from API on component mount
  // কম্পোনেন্ট মাউন্ট হলে API থেকে নোট লোড করা
  useEffect(() => {
    api.get("/api/notes")
      .then((res) => {
        console.log('✅ Notes data:', res.data);
        setNotes(res.data.notes || res.data);
      })
      .catch((err) => {
        console.error('❌ Notes fetch error:', err.response?.data || err.message);
      });
  }, []);

  // Filter notes based on search query (title or date)
  // সার্চ কোয়েরি অনুযায়ী নোট ফিল্টার করা (টাইটেল অথবা তারিখ)
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.date.includes(searchQuery)
  );

  // Calculate pagination indices
  // পেজিনেশন ইনডেক্স হিসাব করা
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  // Navigate to KeepNote page to add new note
  // নতুন নোট যোগ করতে KeepNote পেজে যাওয়া
  const goToKeepNote = () => navigate("/keepnote");

  // Navigate to KeepNote page with note data for editing
  // এডিট করার জন্য নোট ডেটা সহ KeepNote পেজে যাওয়া
  const editNote = (note) => {
    navigate("/keepnote", { state: note });
  };

  // Delete a note from the list
  // লিস্ট থেকে একটি নোট ডিলিট করা
  const deleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await api.delete(`/api/notes/${noteId}`);
        // Refresh notes
        const res = await api.get("/api/notes");
        setNotes(res.data.notes || res.data);
        alert("Note deleted successfully!");
      } catch (err) {
        console.error('Delete error:', err.response?.data || err.message);
        alert("Failed to delete note");
      }
    }
  };

  // Logout function - clear token and redirect to login
  // লগ আউট ফাংশন - টোকেন মুছে লগইন পেজে পাঠানো
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        // Use the logout function from api.js (includes CSRF token)
        const { logout } = await import('../api');
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: clear local storage and redirect
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  return (
    <div className="profile-screen">
      {/* Profile Card / প্রোফাইল কার্ড */}
      <div className="profile-top">
        {/* Logout button / লগ আউট বাটন */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <div className="profile-info">
          {/* Display user data from API if available / API থেকে ইউজার ডেটা দেখানো */}
          {user ? (
            <>
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-text">📧 {user.email}</p>
              <p className="profile-text">📞 {user.phone}</p>
              <p className="profile-text">💼 {user.occupation || "Student"}</p>
            </>
          ) : (
            <>
              <h1 className="profile-name">Loading...</h1>
              <p className="profile-text">📧 ...</p>
              <p className="profile-text">📞 ...</p>
              <p className="profile-text">💼 ...</p>
            </>
          )}
        </div>
        <div>
          {/* Display user's uploaded image or default image / ইউজারের আপলোড করা ইমেজ অথবা ডিফল্ট ইমেজ দেখানো */}
          <img 
            src={user?.image ? user.image : defaultImage} 
            alt="Profile" 
            className="profile-img" 
          />
        </div>
      </div>

      {/* Keep Notes Section / নোট সেকশন */}
      <div className="keepnote-section">
        <div className="keepnote-header">
          <h2>My Notes</h2>
          <button className="add-note-btn" onClick={goToKeepNote}>
            + Add Note
          </button>
        </div>

        {/* Search bar / সার্চ বার */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or date..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset page / পেজ রিসেট করা
            }}
          />
        </div>

        {/* Notes Grid / নোট গ্রিড */}
        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="note-placeholder">No Notes Found</div>
          ) : (
            currentNotes.map((note) => (
              <div key={note.id} className="note-card">
                <h3>{note.title}</h3>
                <small>
                  {note.date} | {note.time}
                </small>
                <p>{note.text}</p>
                <div className="note-actions">
                  <button className="edit-btn" onClick={() => editNote(note)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination / পেজিনেশন */}
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
