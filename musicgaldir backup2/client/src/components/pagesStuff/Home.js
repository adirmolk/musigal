import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Profile from "../profile/Profile";
import checkTokenValidation from "../users/checkTokenValidation";
import Post from "../post/Post";
import PostArea from "../post/PostArea";
import Search from "../customFunctions/Search";
import Friends from "./Friends";

const Home = () => {
  const nav = useNavigate();

  useEffect(() => {
    async function checkToken() {
      const redirectPath = await checkTokenValidation();
      if (redirectPath === "/login") {
        nav("/login");
        localStorage.removeItem("token");
      }
    }

    // Call the checkToken function when the component mounts
    checkToken();
  }, [nav]);
  return (
    <div style={{ backgroundColor: "#ECEBEC" }}>
      <Nav />
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-4 order-md-1">
            {/* On smaller screens (up to medium), it will take up the full width */}
            {/* On larger screens (large and above), it will take up 4 columns */}
            <Profile />
          </div>
          <div className="col-md-12 col-lg-4 order-md-2">
            {/* On smaller screens (up to medium), it will take up the full width */}
            {/* On larger screens (large and above), it will take up 4 columns */}
            <PostArea />
          </div>
          <div className="col-md-12 col-lg-4 order-md-3">
            {/* On smaller screens (up to medium), it will take up the full width */}
            {/* On larger screens (large and above), it will take up 4 columns */}
            <Friends />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Home;
