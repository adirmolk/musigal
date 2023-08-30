import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const nav = useNavigate();

  const [user, setUser] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("http://localhost:3002/users", user);
    console.log(data.data);
    localStorage.clear();
    nav("/login");
  };
  return (
    <div>
      <form id="id_form" onSubmit={onSubmit}>
        <label>name</label>
        <input
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          id="id_name"
          className="form-control"
          type="text"
        />
        <label>email</label>
        <input
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          id="id_email"
          className="form-control"
          type="email"
        />
        <label>password</label>
        <input
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          id="id_password"
          className="form-control"
          type="password"
        />
        <button>submit</button>
      </form>
    </div>
  );
};
export default Signup;
