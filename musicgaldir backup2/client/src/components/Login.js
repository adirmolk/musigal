import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({});

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/users/login', user);
            const token = response.data.token;
            localStorage.setItem('token', token);
            nav('/home');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                <h1 style={{color:"#DDC7A9"}} className="text-center">musigal</h1>
          <p style={{fontWeight:"bold"}} className="text-center">music, everywhere.</p>
                    <form id="id_form" onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="id_email" className="form-label">Email</label>
                            <input
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                id="id_email"
                                className="form-control"
                                type="email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="id_password" className="form-label">Password</label>
                            <input
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                id="id_password"
                                className="form-control"
                                type="password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Log In</button>
                        <button style={{textDecorationLine:"none"}} onClick={()=>nav('/signup')} className="btn btn-link mt-3"><span style={{color:"black"}}>dont have an account? </span>Sign Up</button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
