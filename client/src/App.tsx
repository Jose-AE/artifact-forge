import { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";
import Sidebar from "./components/Sidebar";
import InventoryPage from "./pages/InventoryPage";

function App() {
  return (
    <>
      <Sidebar>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </Sidebar>
    </>
  );
}

export default App;
//https://www.youtube.com/watch?v=TqlVP_IkS28&ab_channel=VeeWebCode
