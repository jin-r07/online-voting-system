import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/user/navbar/navbar";
import Home from "./routes/user/home/home";
import Vote from "./routes/user/vote/vote";
import FAQ from "./routes/user/faq/faq";
import Contact from "./routes/user/contact/contact";
import UserProfile from "./routes/user/userProfile/userProfile";
import UserSettings from "./routes/user/userSettings/userSettings";

import AdminLogin from "./components/admin/login/login";
import Dashboard from "./routes/admin/dashboard/dashboard";
import AdminNavbar from "./components/admin/navbar/navbar";
import Events from "./routes/admin/events/events";
import Candidates from "./routes/admin/candidates/candidates";
import Parties from "./routes/admin/parties/parties";
import Users from "./routes/admin/users/users";
import History from "./routes/admin/history/history";

function App() {
  const location = useLocation();

  // Check if the current path starts with '/admin'
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // Check if the current path is exactly '/admin' (the login route)
  const isAdminLogin = location.pathname === "/admin";

  return (
    <>
      {/* Show User Navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Show Admin Navbar on admin routes, except admin login */}
      {isAdminRoute && !isAdminLogin && <AdminNavbar />}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-settings" element={<UserSettings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin-events" element={<Events />} />
        <Route path="/admin-candidates" element={<Candidates />} />
        <Route path="/admin-parties" element={<Parties />} />
        <Route path="/admin-users" element={<Users />} />
        <Route path="/admin-history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
