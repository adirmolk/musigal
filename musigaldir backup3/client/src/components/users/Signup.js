import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const nav = useNavigate();

  const [user, setUser] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("http://localhost:3001/api/users", user);
    console.log(data.data);
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 style={{ color: "#DDC7A9" }} className="text-center">
            musigal
          </h1>
          <p style={{ fontWeight: "bold" }} className="text-center">
            music, everywhere.
          </p>
          <form id="id_form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="id_name" style={{ fontWeight: "bold",marginTop:"5px",marginBottom:"5px" }}>Name</label>
              <input
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                id="id_name"
                className="form-control"
                type="text"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_email" style={{ fontWeight: "bold",marginTop:"5px",marginBottom:"5px" }}>Email</label>
              <input
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="id_email"
                className="form-control"
                type="email"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_password" style={{ fontWeight: "bold",marginTop:"5px",marginBottom:"5px" }}>Password</label>
              <input
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="id_password"
                className="form-control"
                type="password"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                placeholder="Enter your password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_imgUrl" style={{ fontWeight: "bold",marginTop:"5px",marginBottom:"5px" }}>imgUrl</label>
              <input
                onChange={(e) => setUser({ ...user, imgUrl: e.target.value })}
                id="id_imgUrl"
                className="form-control"
                type="text"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                placeholder="Enter your imgUrl"
              />
            </div>
            <button className="btn btn-primary" style={{marginTop:"20px"}}>Sign Up</button>
            <button
              style={{ textDecorationLine: "none" }}
              onClick={() => nav("/login")}
              className="btn btn-link mt-3"
            >
              <span style={{ color: "black" }}>already have an acount? </span>
              Log In{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
