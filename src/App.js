import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import About from "./Pages/about";
import Description from "./Pages/description";
import Histoire from "./Pages/histoire";
import Reportage from "./Pages/reportages"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/description" element={<Description />} />
        <Route path="/histoire" element={<Histoire />} />
        <Route path="/reportage" element={<Reportage />} />
      </Routes>
    </Router>
  );
}

export default App;
