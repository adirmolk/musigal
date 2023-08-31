import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import Home from "./Home";
import Welcome from "./Welcome";


const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
