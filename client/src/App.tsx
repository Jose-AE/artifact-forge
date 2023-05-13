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
import { useEffect } from "react";

async function verifyToken() {
  //check if jwt is still valid
  try {
    await axios
      .get(import.meta.env.VITE_API_URI + "/user/verify-token", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "invalid") {
          loginAsGuest();
        }
      })
      .catch((err) => {});
  } catch (err) {}
}

function loginAsGuest() {
  localStorage.setItem("userIsLoggedIn", "false");
  if (!localStorage.getItem("guestId")) {
    localStorage.setItem("guestId", uuidv4());

    axios
      .post(
        import.meta.env.VITE_API_URI + "/user/create-guest",
        {
          guestId: localStorage.getItem("guestId"),
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("gest acc created");
      })
      .catch((err) => {
        localStorage.removeItem("guestId");
        console.log(err);
      });
  } else {
    axios
      .post(
        import.meta.env.VITE_API_URI + "/user/logout",
        { guestId: localStorage.getItem("guestId") },
        {
          withCredentials: true,
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
}

function App() {
  let AppMounted = false;
  useEffect(() => {
    if (!AppMounted) {
      verifyToken();
      AppMounted = true;
    }
  }, []);

  /*
  let AppMounted = false;
  useEffect(() => {
    if (!AppMounted) {
      //if first time visit log in as guest
      if (!localStorage.getItem("userIsLoggedIn")) {
        loginAsGuest();
      } else {
        //if returning user verify token
      }
      AppMounted = true;
    }
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
