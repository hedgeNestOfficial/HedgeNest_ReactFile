import React from "react";
import Button from "./Components/Button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./Pages/HeroPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
