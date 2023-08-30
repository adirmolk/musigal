import React, { useState } from "react";
import FriendsList from "./FriendsList";

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
      <div
        className={`d-flex p-2 ${
          darkMode ? "text-bg-dark" : "text-bg-light"
        } justify-content-between`}
      >
        <h1 className="mt-1 mx-4">welcome</h1>

        <div className={`p-2 d-flex align-items-center`}>
          <span className={`p-2 d-${menuOpen ? "none" : "block"}`}>
            profile
          </span>
          <FriendsList />
          <button className={`btn bg-light`} onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="p-2 btn text-bg-light" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>
      {/* Render the menu here based on the menuOpen state */}
      {menuOpen && <div className="menu">{/* ... Menu content */}</div>}
    </div>
  );
};

export default Nav;
