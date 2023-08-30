import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({})
    const onSubmit = async(e) => {
        e.preventDefault();
        const data = await axios.post('http://localhost:3002/users/login', user)
        console.log(data);
        const token = data.data.token;
        localStorage.setItem('token', token);
        nav("/home")

}
  return (
    <div>       
        <form id="id_form" onSubmit={onSubmit}>
    <label>email</label>
    <input onChange={(e)=>setUser({...user, email: e.target.value})} id="id_email" className="form-control" type="email" />
    <label>password</label>
    <input onChange={(e)=>setUser({...user, password: e.target.value})} id="id_password" className="form-control" type="password" />
    <button>submit</button>
  </form></div>
  )
}

export default Login