import React from "react";
import { useUser } from "../users/UserContext";
import CurrentlyPlaying from "../spotify/CurrentlyPlaying";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate()

  return (
    <div style={{}} className="container d-flex mt-4">
      <div className="row">
        <div className="">
          {user ? (
            <div
              style={{
                backgroundColor: "white",
                width: "",
              }}
              className="rounded p-4"
            >
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src={user.imgUrl||"https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"}
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
                    <span className="text-muted mb-0" style={{ fontSize: "15px" }}>
                      {user.level >= 150 ? "Pro" : user.level >= 50 ? "Maxim" : "Noob"}
                    </span>{" "} &#8226;
                   
                    <span className="text-muted ms-1" style={{ fontSize: "15px" }}>
                       {user.friends.length} Friends
                    </span>
                  </div>
                </div>
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
    </div>
  );
};

export default Profile;
