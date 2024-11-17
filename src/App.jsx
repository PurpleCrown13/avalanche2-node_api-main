import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Books from "../pages/Books";
import Add from "../pages/Add";
import Read from "../pages/Read";
import ReadTwoColumns from "../pages/ReadTwoColumns";
import "./App.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect } from "react";

const PageRoutes = () => {
  const [parent, enableAnimations] = useAutoAnimate();

  useEffect(() => {
    enableAnimations();
  }, []);
  return (
    <div ref={parent}>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/add" element={<Add />} />
        <Route path="/read/:id" element={<Read />} />
        <Route path="/readtwocolumns/:id" element={<ReadTwoColumns />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <PageRoutes />
    </Router>
  );
};

export default App;
