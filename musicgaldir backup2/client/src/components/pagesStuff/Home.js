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
    <div style={{ backgroundColor: "#ECEBEC", height: "100%", width: "100%" }}>
      <Nav />
      <div className="d-flex">
        <div className="">
          {" "}
          <Profile />
          {/* <Search/> */}
        </div>
        <div className="">
          {" "}
          {/* <Post /> */}
          <PostArea />
        </div>
        <div className="">
          {" "}
          {/* <Post /> */}
<Friends/>        </div>
      </div>
    </div>
  );
};

export default Home;
