import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "../users/Signup";
import Login from "../users/Login";
import Profile from "../profile/Profile";
import Home from "./Home";
import Welcome from "./Welcome";
import Post from "../post/Post";
import ProfilesErea from "../profile/ProfilesErea";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/home/post" element={<Post />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/profiles" element={<ProfilesErea />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
