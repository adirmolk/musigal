import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongRating from "../customFunctions/SongRating";
import { css } from "@emotion/react";
import SkullLoading from "../customFunctions/SkullLoading";

const SongPost = () => {
  const [postSongs, setPostSongs] = useState([]);
  const [authenticatedUserId, setAuthenticatedUserId] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState(0);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/profile/${userId}`,
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      const user = response.data;
      setAuthenticatedUserId(user._id);
      setUser((prevUsers) => ({ ...prevUsers, [userId]: user }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const ShowSongs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/songs", {
        headers: { "x-api-key": localStorage.getItem("token") },
      });

      for (const song of data) {
        fetchUserProfile(song.user_id);
      }

      setTimeout(() => {
        setPostSongs(data);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ShowSongs();
  }, []);

  return (
    <div>
      {postSongs.length === 0 ? ( // Display the Loading component when postSongs is empty
        <div className="text-center mt-4">
          <SkullLoading />
        </div>
      ) : (
        postSongs.map((song, index) => (
          <div
            className="mt-4 mx-4 p-2 rounded"
            style={{
              backgroundColor: "white",
              width: "400px",
            }}
            key={index}
          >
            <div className="p-2 justify-content-evenly">
              <div className="d-flex align-items-center">
                <img
                  src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="mx-3">
                  <h4
                    onClick={() => navigate(`/profile/${song.user_id}`)}
                    style={{ cursor: "pointer", margin: "0" }}
                  >
                    {user && user[song.user_id]
                      ? user[song.user_id].name
                      : "Unknown User"}
                  </h4>
                  <p className="text-muted mb-0">
                    {user && user[song.user_id]
                      ? user[song.user_id].level >= 150
                        ? "Pro"
                        : user[song.user_id].level >= 50
                        ? "Maxim"
                        : "Noob"
                      : "Unknown Level"}
                  </p>
                </div>
                {/* <button
                style={{ backgroundColor: "#DDC7A9" }}
                className="btn ms-5"
              >
                <img
                  src={process.env.PUBLIC_URL + "/add-user.png"}
                  alt="Song 2"
                  className="mb-1"
                  style={{ width: "16px", height: "16px" }}
                />
              </button> */}
              </div>
              <hr />
              <div
                className="instagram-post rounded"
                style={{
                  width: "300px",
                  marginBottom: "20px",
                  position: "relative",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              >
                <img
                  className="rounded mt-4"
                  src={song.img_url}
                  alt={`${song.title} Album Cover`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div
                  className="text-center"
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#DDC7A9",
                    padding: "10px",
                    borderRadius: "0 0 5px 5px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: "0",
                    }}
                  >
                    {song.title}
                  </p>
                  <p style={{ fontSize: "14px", margin: "0" }}>{song.artist}</p>
                </div>
              </div>
              {user && user[song.user_id] ? (
                //  && user[song.user_id]._id !== authenticatedUserId
                <SongRating
                  songId={song._id}
                  userId={user[song.user_id]._id}
                  user={user}
                  userLevel={userLevel}
                  updateLevel={(newLevel) => {
                    setUserLevel(newLevel);
                  }}
                />
              ) : (
                <p className="mt-2">You cant rank your own song.</p>
              )}

              <p style={{}} className=" d-inline fw-bold mt-3">
                {user && user[song.user_id]
                  ? user[song.user_id].name
                  : "Unknown User"}
              </p>
              <p
                style={{
                  maxWidth: "400px",
                  height: "auto",
                  overflow: "hidden",
                }}
                className=""
              >
                {" "}
                {song.description}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SongPost;