import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Nav from "./Nav";
import axios from "axios";
import Profile from "./Profile";
import _ from "lodash";

const Home = () => {
  return (
    <div style={{backgroundColor:"#F4F3F4",height:"740px"}}>
      <Nav />
      <Profile />
    </div>
  );
};

export default Home;
