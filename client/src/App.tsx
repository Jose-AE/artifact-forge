import { useState, useEffect, createContext } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";
import Sidebar from "./components/Sidebar";
import InventoryPage from "./pages/InventoryPage";
import SettingsPage from "./pages/SettingsPage";
import axios from "axios";
import ExplorePage from "./pages/ExplorePage";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/LoginPage";

export const LoginContext = createContext<any>(null);

interface UserInterface {
  username: string;
  pfp: string;
}

function App() {
  const [loggedUser, setLoggedUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    //fetch logged user
    axios
      .get(import.meta.env.VITE_API_URI + "/user/get", {
        withCredentials: true,
      })
      .then((res) => {
        setLoggedUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Analytics />
      <LoginContext.Provider value={{ loggedUser, setLoggedUser }}>
        <Sidebar>
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Sidebar>
      </LoginContext.Provider>
    </>
  );
}

export default App;
//https://www.youtube.com/watch?v=TqlVP_IkS28&ab_channel=VeeWebCode
