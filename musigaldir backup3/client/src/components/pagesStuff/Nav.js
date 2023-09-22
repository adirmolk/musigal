import React, { useState } from "react";
import FriendsList from "../spotify/FriendsList";
import Search from "../customFunctions/Search";

const Nav = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        <div className="container">

          <a className="navbar-brand ms-4" href="/home" style={{ color: "#DDC7A9" }}>
            <h3>musigal</h3>
          </a>

          <button
            className="navbar-toggler btn"
            type=""
            onClick={toggleMenu}
          >
            <img width={"16px"} src={process.env.PUBLIC_URL + "/more.png"}/>
          </button>

          <div
            className={`collapse navbar-collapse justify-content-end ${
              menuOpen ? "show" : ""
            }`}
          >
            <ul className="navbar-nav">
            
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    !menuOpen ? "d-none d-lg-block" : ""
                  }`}
                >
                  <Search />
                </span>
              </li>
              <li className="nav-item mt-1 ">
                <FriendsList isOpen={menuOpen} />
              </li>
              <li className="nav-item mt-2">
                <button
                  className={`btn d-none d-lg-block`}
                  onClick={toggleDarkMode}
                >
                  {darkMode ? <img  width={"23px"} src={process.env.PUBLIC_URL + "/night-mode (1).png"}/> : <img width={"15px"} src={process.env.PUBLIC_URL + "/brightness.png"}/>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );

};

export default Nav;
