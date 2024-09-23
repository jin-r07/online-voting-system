import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/navbar"
import Home from "./routes/home/home";
import Vote from "./routes/vote/vote";
import FAQ from "./routes/faq/faq";
import Contact from "./routes/contact/contact";
import UserProfile from "./routes/userProfile/userProfile";
import UserSettings from "./routes/userSettings/userSettings";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-settings" element={<UserSettings />} />
      </Routes>
    </>
  )
}

export default App
