import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/login",
        {
          params: {
            email: user.email,
            password: user.password,
          },
        }
      );
      toast.success("Login successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
      console.log(response.data);
      const token = response.data;
      localStorage.setItem("token", token);
      nav("/home");
    } catch (error) {
      toast.error("Email or password is incorrect", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      console.error("Login error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 style={{ color: "#DDC7A9" }} className="text-center">
            musigal
          </h1>
          <p style={{ fontWeight: "bold" }} className="text-center">
            music, everywhere.
          </p>
          <form id="id_form" onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="id_email" className="form-label" style={{ fontWeight: "bold" }}
              >
                Email
              </label>
              <input
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="id_email"
                className="form-control custom-shadow"
                type="email"
                placeholder="Enter your email"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="id_password" className="form-label" style={{ fontWeight: "bold" }}>
                Password
              </label>
              <input
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="id_password"
                className="form-control custom-shadow"
                type="password"
                placeholder="Enter your password"
                style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Log In
            </button>
            <button
              style={{ textDecorationLine: "none" }}
              onClick={() => nav("/signup")}
              className="btn btn-link mt-3"
            >
              <span style={{ color: "black" }}>Don't have an account? </span>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
