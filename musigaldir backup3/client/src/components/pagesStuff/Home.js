import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Profile from "../profile/Profile";
import checkTokenValidation from "../users/checkTokenValidation";
import PostArea from "../post/PostArea";
import Friends from "./Friends";
import Leaderboards from "./Leaderboards";
import eventBus from "../EventBus/eventBus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ECEBEC");
  const [childrenBgColor, setchildrenBgColor] = useState("white");

  const nav = useNavigate();

  useEffect(() => {
    async function checkToken() {
      const redirectPath = await checkTokenValidation();
      if (redirectPath === "/login") {
        nav("/login");
        localStorage.removeItem("token");
      }
    }
    checkToken();
    const handleThemeChange = (newMode) => {
      setDarkMode(newMode);
      setBackgroundColor(newMode ? "#ECEBEC" : "#2E2E2E");
      setchildrenBgColor(!newMode ? "lavender" : "white");
    };

    eventBus.on("themeChanged", handleThemeChange);

    return () => {
      eventBus.removeListener("themeChanged", handleThemeChange);
    };
  }, [nav]);

  useEffect(() => {
    const handleUserDeleted = (user) => {
      console.log(user);

      toast.success(`${user?.name} user deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    };
    eventBus.on("userDeleted", handleUserDeleted);
    return () => {
      eventBus.off("userDeleted", handleUserDeleted);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    eventBus.emit("themeChanged", !darkMode);
  };

  return (
    <div style={{ backgroundColor, height: "fit-content", minHeight: "110vh" }}>
      <Nav />
      <div className="container">
        <ToastContainer />
        <div className="row">
          <div className="col-md-12 col-lg-4 order-md-1">
            <Profile color={childrenBgColor} />
          </div>
          <div className="col-md-12 col-lg-4 order-md-2">
            <PostArea color={childrenBgColor} />
          </div>
          <div className="col-md-12 col-lg-4 order-md-3">
            <Friends color={childrenBgColor} />
            <Leaderboards color={childrenBgColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
