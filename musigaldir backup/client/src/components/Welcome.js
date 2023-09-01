import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          {token ? (
            <div className="text-center">
          <h1 style={{color:"#DDC7A9"}} className="text-center">musigal</h1>
          <p style={{fontWeight:"bold"}} className="text-center">music, everywhere.</p>
              <button className="btn btn-primary mt-3" onClick={() => nav("/home")}>Go to Home</button>
              <button className="btn btn-secondary mt-3" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="text-center">
          <h1 style={{color:"#DDC7A9"}} className="text-center">musigal</h1>
          <p style={{fontWeight:"bold"}} className="text-center">music, everywhere.</p>
              <button className="btn btn-primary mt-3" onClick={() => nav("/login")}>Log In</button>
              <button className="btn btn-info mt-3" onClick={() => nav("/signup")}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
