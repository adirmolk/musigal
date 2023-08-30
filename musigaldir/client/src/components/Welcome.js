import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login"); // Redirect to the login page after logout
  };

  return (
    <div>
      {token ? (
        <div>
          <p>Welcome to the Home page!</p>
          <button onClick={() => nav("/home")}>home</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => nav("/login")}>login</button>
          <button onClick={() => nav("/signup")}>signup</button>
        </div>
      )}
    </div>
  );
};

export default Welcome;
