import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import KeepNote from "./pages/KeepNote";
import Landing from "./pages/landing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Landing page - Default first page / ল্যান্ডিং পেজ - প্রথম পেজ */}
        <Route path="/" element={<Landing/>} />

        {/* Login page / লগইন পেজ */}
        <Route path="/login" element={<Login/>} />

        {/* Signup page / সাইন আপ পেজ */}
        <Route path="/signup" element={<Signup/>} />

        {/* Profile page - Protected / প্রোফাইল পেজ - সুরক্ষিত */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        } />

        {/* KeepNote page - Protected / কিপনোট পেজ - সুরক্ষিত */}
        <Route path="/keepnote" element={
          <PrivateRoute>
            <KeepNote/>
          </PrivateRoute>
        } />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
