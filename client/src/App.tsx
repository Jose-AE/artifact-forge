import { Navigate, Route, Routes } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";
import Sidebar from "./components/Sidebar";
import InventoryPage from "./pages/InventoryPage";
import AboutPage from "./pages/AboutPage";
import axios from "axios";
import ExplorePage from "./pages/ExplorePage";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/LoginPage";

interface UserInterface {
  username: string;
  pfp: string;
}

function App() {
  //if new user
  if (!localStorage.getItem("userIsLoggedIn")) {
    localStorage.setItem("loggedUser", "false");
  }

  /* useEffect(() => {
    //fetch logged user
    axios
      .get(import.meta.env.VITE_API_URI + "/user/get", {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem("loggedUser", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  */

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
