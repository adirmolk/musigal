import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CurrentlyPlaying from "../spotify/CurrentlyPlaying";
import Post from "../post/Post";
import FriendsList from "../spotify/FriendsList";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/users/profile", {
          headers: {
            "x-api-key": token,
          },
        })
        .then((response) => {
          setUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [navigate]);

  return (
    <div style={{ width: "400px" }} className="container d-flex  mt-4 mx-5">
      <div className="row mb-5">
        <div className="">
          {user ? (
            <div
              style={{
                backgroundColor: "white",
                // border: "lightgray 1px solid",
                width: "400px",
              }}
              className="rounded p-4 "
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <div className="mx-3">
                    <h3
                      onClick={() => navigate(`/profiles/${user._id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user.name}
                    </h3>
                    <span className="text-muted mb-0">
                      {user.level >= 150
                        ? "Pro"
                        : user.level >= 50
                        ? "Maxim"
                        : "Noob"}
                    </span> &#8226;
                    <span className=" text-muted">
                      {" "}
                      {user.friends.length} following
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/home/post")}
                  style={{ backgroundColor: "#DDC7A9" }}
                  className="btn badge fw-bold fs-5 h-50  mt-2 "
                >
                  +
                </button>
                {/* <FriendsList/> */}
              </div>
              <hr />
              <CurrentlyPlaying />
              <hr />
              <div className="p-3">
                <h5 className="font-weight-bold mb-3">Social Profiles</h5>
                <div className="d-flex justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <img
                      src={process.env.PUBLIC_URL + "/twitter.png"}
                      alt="Twitter"
                      className="mr-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <div className="mx-3">
                      <p className="font-weight-bold mb-0">Twitter</p>
                      <p className="text-muted">Social Network</p>
                    </div>
                  </div>
                  <i className="bi bi-pencil"></i>{" "}
                </div>
                <div className="d-flex justify-content-between ">
                  <div className="d-flex align-items-center ">
                    <img
                      src={process.env.PUBLIC_URL + "/spotify.png"}
                      alt="LinkedIn"
                      className="mr-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <div className="mx-3">
                      <p className="font-weight-bold mb-0">Spotify</p>
                      <p className="text-muted">Music Platform</p>
                    </div>
                  </div>
                  <i className="bi bi-pencil"></i>{" "}
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {/* <Post/> */}
    </div>
  );
};

export default Profile;
