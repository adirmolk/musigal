import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "../users/Signup";
import Login from "../users/Login";
import Profile from "../profile/Profile";
import Home from "./Home";
import Welcome from "./Welcome";
import Post from "../post/Post";
import ProfilesErea from "../profile/ProfilesErea";
import VinylWall from "../profile/VinylWall";

import { UserProvider } from "../users/UserContext";
import DailyChallenge from "../dailyChallenge/DailyChallenge";
import AlbumChallenge from "../dailyChallenge/AlbumChallenge";
import { ChallengeProvider } from "../dailyChallenge/ChallengeContext";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ChallengeProvider>
        <Routes>
          <Route path="/" element={<Welcome />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/home/dailychallenge" element={<DailyChallenge />}></Route>
          <Route path="/home/album" element={<AlbumChallenge />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profiles/:id" element={<ProfilesErea />}></Route>
          <Route path="/vinylwall/:id" element={<VinylWall />}></Route>
        </Routes>
        </ChallengeProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default MainRoutes;
