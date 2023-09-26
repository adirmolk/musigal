import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const nav = useNavigate();

  const [user, setUser] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("http://localhost:3001/users", user);
    console.log(data.data);
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 style={{color:"#DDC7A9"}} className="text-center">musigal</h1>
          <p style={{fontWeight:"bold"}} className="text-center">music, everywhere.</p>
          <form id="id_form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="id_name">Name</label>
              <input
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                id="id_name"
                className="form-control"
                type="text"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_email">Email</label>
              <input
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="id_email"
                className="form-control"
                type="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_password">Password</label>
              <input
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="id_password"
                className="form-control"
                type="password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_imgUrl">imgUrl</label>
              <input
                onChange={(e) => setUser({ ...user, imgUrl: e.target.value })}
                id="id_imgUrl"
                className="form-control"
                type="text"
              />
            </div>
            <button className="btn btn-primary">Sign Up</button>
            <button style={{textDecorationLine:"none"}} onClick={()=>nav('/login')} className="btn btn-link mt-3"><span style={{color:"black"}}>already have an acount? </span>Log In </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
