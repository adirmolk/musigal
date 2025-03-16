import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongRating from "../customFunctions/SongRating";
import SongLoading from "../customFunctions/SongLoading";
import eventBus from "../EventBus/eventBus";
import { useUser } from "../users/UserContext";

const SongPost = ({ userId, color }) => {
  const [postSongs, setPostSongs] = useState([]);
  const [authenticatedUserId, setAuthenticatedUserId] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const logUser = useUser();
  const [loggedInUser, setLoggedInUser] = useState(logUser);

  const handleDeleteConfirmation = (song) => {
    setSongToDelete(song);
    setShowDeleteConfirmation(true);
  };

  const ShowSongs = async () => {
    console.log(loggedInUser + "HEREEEEEEEEEEEEEE");

    try {
      const response = await axios.get(
        userId == null
          ? `http://localhost:3001/api/songs/friends?userId=${loggedInUser.id}`
          : `http://localhost:3001/api/songs/getSongsByUserId/${userId}`,
        {
          headers: { "x-api-key": localStorage.getItem("token") },
        }
      );
      console.log(response.data);

      // for (const song of response.data) {
      //   fetchUserProfile(song.userId);
      // }

      setPostSongs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const songs = async () => {
    console.log(loggedInUser + "HEREEEEEEEEEEEEEE");

    try {
      const response = await axios.get(
        `http://localhost:3001/api/songs/getSongsByUserId/${userId}`,
        {
          headers: { "x-api-key": localStorage.getItem("token") },
        }
      );
      console.log(response.data);

      // for (const song of response.data) {
      //   fetchUserProfile(song.userId);
      // }

      setPostSongs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deleteSong = async (song) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/songs/${song.id}?userId=${logUser.id}`,
        {
          headers: { "x-api-key": localStorage.getItem("token") },
          data: song,
        }
      );
      console.log("Song deleted:", response.data);

      // Emit an event to notify other components about the deletion
      eventBus.emit("songDeleted", song.id);
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };
  useEffect(() => {
    const handleProfileUpdated = () => {
      ShowSongs();
    };

    eventBus.on("profileUpdated", handleProfileUpdated);

    return () => {
      eventBus.off("profileUpdated", handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    ShowSongs();

    const handleNewSong = (newSong) => {
      setPostSongs((prevSongs) => [newSong, ...prevSongs]);
    };

    eventBus.on("songPosted", handleNewSong);

    return () => {
      eventBus.off("songPosted", handleNewSong);
    };
  }, []);
  const getLoggedinUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    console.log(token + " logged invsdgvsdvsdvsdvs");

    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/profile",
        {
          headers: { "x-api-key": token },
        }
      );
      console.log(
        response.data +
          "psjvmosvjsovsvnsbusnbsbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      );

      setLoggedInUser(response.data);
      // ShowSongs();
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
      navigate("/login"); // Redirect if token is invalid
    }
  };
  useEffect(() => {
    getLoggedinUser();
  }, []);
  useEffect(() => {
    ShowSongs();
  }, [loggedInUser || userId]);

  useEffect(() => {
    const handleFriendsUpdated = (followedUser) => {
      ShowSongs();
    };

    eventBus.on("friendsUpdated", handleFriendsUpdated);

    return () => {
      eventBus.off("friendsUpdated", handleFriendsUpdated);
    };
  }, []);

  useEffect(() => {
    const handleSongDeleted = (songId) => {
      setPostSongs((prevSongs) =>
        prevSongs.filter((song) => song.id !== songId)
      );
    };

    eventBus.on("songDeleted", handleSongDeleted);

    return () => {
      eventBus.off("songDeleted", handleSongDeleted);
    };
  }, []);

  return (
    <div>
      {postSongs.length === 0 ? (
        <div className="text-center mt-4">
          <SongLoading />
        </div>
      ) : (
        postSongs.map((song, index) =>
          // Add a conditional check here to show posts only if userId matches loggedInUser
          (userId && song.userId === userId) || !userId ? (
            <div
              className="mt-4 mx-4 p-2 rounded"
              style={{
                backgroundColor: color,
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
                      song.user?.imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-2">
                    <h5
                      onClick={() => navigate(`/profiles/${song.userId}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {song.user ? song.user?.name : "Unknown User"}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      {song.user
                        ? song.user?.level >= 150
                          ? "Pro "
                          : song.user?.level >= 50
                          ? "Maxim "
                          : "Noob "
                        : "Unknown Level"}
                      <span style={{ fontSize: "14px" }} className="text-muted">
                        &#8226; {song.user?.friends?.length ?? 0} Friends
                      </span>
                    </p>
                  </div>
                </div>
                {song.userId == logUser.id && (
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

                    {/* <button id={index} className="btn">
                      <img
                        src={process.env.PUBLIC_URL + "/pen.png"}
                        alt="Song 2"
                        className="mb-1"
                        style={{ width: "16px", height: "16px" }}
                      />
                    </button> */}
                  </div>
                )}
              </div>
              {showDeleteConfirmation &&
                songToDelete &&
                songToDelete.id === song.id && (
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
                  src={song.imgUrl}
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
              <div className="ms-1">
                {song.userId ? (
                  <SongRating
                    songId={song.id}
                    userId={song.user?.id}
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
        )
      )}
    </div>
  );
};

export default SongPost;
