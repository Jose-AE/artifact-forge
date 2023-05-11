import { Navigate, Route, Routes } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";
import Sidebar from "./components/Sidebar";
import InventoryPage from "./pages/InventoryPage";
import AboutPage from "./pages/AboutPage";
import axios from "axios";
import ExplorePage from "./pages/ExplorePage";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/LoginPage";
import { v4 as uuidv4 } from "uuid";

interface UserInterface {
  username: string;
  pfp: string;
}

function App() {
  //if first time user log in as guest
  if (
    !localStorage.getItem("guestId") &&
    localStorage.getItem("userIsLoggedIn") === "false"
  ) {
    const guestId = uuidv4();
    localStorage.setItem("guestId", guestId);

    axios
      .post(
        import.meta.env.VITE_API_URI + "/user/create-guest",
        {
          guestId: guestId,
        },
        { withCredentials: true }
      )
      .then((res) => {})
      .catch((err) => {
        localStorage.removeItem("guestId");
        console.log(err);
      });
  }

  if (!localStorage.getItem("userIsLoggedIn")) {
    localStorage.setItem("userIsLoggedIn", "false");
  }

  return (
    <>
      <Analytics />
      <Sidebar>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/settings" element={<AboutPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Sidebar>
    </>
  );
}

export default App;
