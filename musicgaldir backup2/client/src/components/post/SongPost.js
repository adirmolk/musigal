import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongRating from "../customFunctions/SongRating";
import { css } from "@emotion/react";
import SongLoading from "../customFunctions/SongLoading";

const SongPost = ({ userId }) => {
  const [postSongs, setPostSongs] = useState([]);
  const [authenticatedUserId, setAuthenticatedUserId] = useState("");
  const [user, setUser] = useState(null);
  const [loggedInUser, setloggedInUser] = useState(null);

  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const handleDeleteConfirmation = (song) => {
    setSongToDelete(song);
    setShowDeleteConfirmation(true);
  };

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
      console.log("user: ", user);
      setAuthenticatedUserId(user._id);
      setUser((prevUsers) => ({ ...prevUsers, [userId]: user }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const ShowSongs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/songs/friends", {
        headers: { "x-api-key": localStorage.getItem("token") },
      });

      for (const song of data) {
        fetchUserProfile(song.user_id);
        console.log(song);
        getLoggedinUser();
      }

      setTimeout(() => {
        setPostSongs(data);
      }, 1500);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteSong = async (song) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/songs/${song._id}`,
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
          data: song,
        }
      );
      console.log("Song deleted:", response.data);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
    navigate(0);
  };

  useEffect(() => {
    ShowSongs();
  }, []);

  const getLoggedinUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      await axios
        .get("http://localhost:3001/users/profile", {
          headers: {
            "x-api-key": token,
          },
        })
        .then((response) => {
          setloggedInUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      {postSongs.length === 0 ? (
        <div className="text-center mt-4">
          <SongLoading />
        </div>
      ) : (
        postSongs.map((song, index) => (
          // Add a conditional check here to show posts only if userId matches loggedInUser
          (userId && song.user_id === userId) || !userId ? (
            <div
              className="mt-4 mx-4 p-2 rounded"
              style={{
                backgroundColor: "white",
                width: "",
              }}
              key={index}
            >
              <div
                className="p-2 justify-content-between align-items-center"
                style={{ display: "flex" }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={
                      user[song.user_id].imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-2">
                    <h5
                      onClick={() => navigate(`/profiles/${song.user_id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user && user[song.user_id]
                        ? user[song.user_id].name
                        : "Unknown User"}
                    </h5>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "14px" }}
                    >
                      {user && user[song.user_id]
                        ? user[song.user_id].level >= 150
                          ? "Pro "
                          : user[song.user_id].level >= 50
                          ? "Maxim "
                          : "Noob "
                        : "Unknown Level"}
                      <span
                        style={{ fontSize: "14px" }}
                        className="text-muted"
                      >
                        &#8226; {user[song.user_id].friends.length} Friends
                      </span>
                    </p>
                  </div>
                </div>
                {song.user_id == loggedInUser._id && (
                  <div>
                    <button
                      id={index}
                      className="btn"
                      onClick={() => handleDeleteConfirmation(song)}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/trash-can.png"}
                        alt="Song 2"
                        className="mb-1"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </button>

                    <button id={index} className="btn">
                      <img
                        src={process.env.PUBLIC_URL + "/pen.png"}
                        alt="Song 2"
                        className="mb-1"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </button>
                  </div>
                )}
              </div>
              {showDeleteConfirmation && song.user_id == loggedInUser._id && (
                <div className="confirmation-modal">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteSong(song)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div
                className="instagram-post rounded"
                style={{
                  width: "98%",
                  marginBottom: "20px",
                  position: "relative",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              >
                <img
                  className="rounded mt-3"
                  src={song.img_url}
                  alt={`${song.title} Album Cover`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px 10px 0 0",
                    border: "lightgray 1px solid",
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
                    style={{ fontWeight: "bold", fontSize: "16px", margin: "0" }}
                  >
                    {song.title}
                  </p>
                  <p style={{ fontSize: "14px", margin: "0" }}>{song.artist}</p>
                </div>
              </div>
              <div className="ms-1">
                {user && user[song.user_id] ? (
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
                  <p className="mt-2">You can't rank your own song.</p>
                )}

                <p
                  style={{
                    maxWidth: "400px",
                    height: "auto",
                    overflow: "hidden",
                  }}
                  className=""
                >
                  {song.description}
                </p>
              </div>
            </div>
          ) : null
        ))
      )}
    </div>
  );
};

export default SongPost;
