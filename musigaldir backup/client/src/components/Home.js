import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Nav from "./Nav";
import Profile from "./Profile";
import checkTokenValidation from "./checkTokenValidation";
import Post from "./Post";

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
    <div style={{ backgroundColor: "#F4F3F4", height: "100%", width:"100%" }}>
      <Nav />
      <div className="d-flex">
        <div className="">
          {" "}
          <Profile />
        </div>
        <div className="">
          {" "}
          <Post />
        </div>
      </div>
    </div>
  );
};

export default Home;
