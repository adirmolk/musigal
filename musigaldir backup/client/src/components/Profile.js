import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import { useNavigate } from "react-router-dom";
import App from "./Body";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated (token present)
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Fetch user data using the token
      axios
        .get("http://localhost:3001/users/profile", {
          headers: {
            "x-api-key": token,
          },
        })
        .then((response) => {
          setUser(response.data);
          console.log(response.data); // Set the user data
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-5">
          {user ? (
            <div className="card bg-light">
              <div className="card-body d-flex">
                <div className="img ">
                  <img
                    src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "60px", height: "60px" }}
                  />
                </div>
                <div className="user-info p-2">
                  <div>
                    <p className="text-success">
                      <strong>Username:</strong> {user.name}
                    </p>
                    <p className="text-success">
                      <strong>Level:</strong> {user.role}
                    </p>
                    <p className="me">
                      <strong>Minutes Played:</strong> {user.minutesPlayed}
                    </p>
                    <p>
                      <strong>Favorite Song:</strong> {user.favoriteSong}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <App />
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
