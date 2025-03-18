import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../EventBus/eventBus";

const Search = () => {
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const navigate = useNavigate();
  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/users/profile",
          {
            headers: {
              "x-api-key": token,
            },
          }
        );
        setUser(response.data);
        friendsGet(response.data.id);
        setLoggedInUser(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    getProfile();
  }, [navigate]);
  const friendsGet = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/friends?userId=${userId}`
      );
      setFriends(response.data.friendsArr);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  const handleSearch = async () => {
    try {
      if (searchCriteria.trim() === "") {
        setSearchResults([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/users/search?criteria=${searchCriteria}`
      );

      const users = response.data;
      setSearchResults(users);
      setFriends(users);
    } catch (error) {
      console.error(error);
    }
  };

  const delayedSearch = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const newTimeout = setTimeout(() => {
      handleSearch();
    }, 500);
    setTypingTimeout(newTimeout);
  };

  const toggleFollow = async (targetUserId) => {
    try {
      if (!followStatus[targetUserId]) {
        const response = await axios.put(
          "http://localhost:3001/api/users/follow",
          { userId: loggedInUser.id, targetUserId },
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(false);
        } else {
        }
      } else {
        const response = await axios.put(
          "http://localhost:3001/api/users/unfollow",
          { userId: loggedInUser.id, targetUserId },
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );

        if (response.status === 200) {
          setIsFollowed(true);
        } else {
        }
      }
      setSearchCriteria("");
      if (loggedInUser && user && friends?.length > 0) {
        const followStatusCopy = { ...followStatus };
        friends.forEach((friend) => {
          followStatusCopy[friend.id] = loggedInUser.friends.includes(
            friend.id.toString()
          );
        });
        setFollowStatus(followStatusCopy);
      }
      eventBus.emit("friendsUpdated", targetUserId);
    } catch (error) {}
  };
  useEffect(() => {
    const handleFriendsUpdated = () => {
      getProfile();
    };
    eventBus.on("friendsUpdated", handleFriendsUpdated);
    return () => {
      eventBus.off("friendsUpdated", handleFriendsUpdated);
    };
  }, [loggedInUser]);
  useEffect(() => {
    delayedSearch();
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchCriteria]);
  useEffect(() => {
    if (loggedInUser && user && friends?.length > 0) {
      const followStatusCopy = { ...followStatus };
      friends.forEach((friend) => {
        followStatusCopy[friend.id] = loggedInUser.friends.includes(
          friend.id.toString()
        );
      });
      setFollowStatus(followStatusCopy);
    }
  }, [loggedInUser, user, friends]);

  return (
    <div className="ms-5">
      <input
        type="text"
        placeholder="Search For Users..."
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        className="rounded-pill p-2 border"
      />
      <div
        className="search-results rounded mt-5"
        style={{
          position: "absolute",
          top: "50px",
          right: "100px",
          width: "430px",
          maxHeight: "300px",
          overflowY: "auto",
          backgroundColor: "white",
        }}
      >
        {searchResults.map((user, index) => (
          <div
            className="d-flex justify-content-between mt-2 mb-1 p-2 rounded"
            style={{
              width: "400px",
              backgroundColor: "",
            }}
            key={user.id}
          >
            <div className="d-flex align-items-center">
              <img
                src={
                  user.imgUrl ||
                  "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                }
                alt="Profile"
                className="rounded-circle"
                style={{ width: "60px", height: "60px" }}
              />
              <div className="mx-3">
                <h3
                  onClick={() => {
                    navigate(`/profiles/${user.id}`);
                  }}
                  style={{ cursor: "pointer", margin: "0" }}
                >
                  {user.name}
                </h3>
                <span className="text-muted mb-0">
                  {user.level >= 150
                    ? "Pro "
                    : user.level >= 50
                    ? "Maxim "
                    : "Noob "}
                </span>
                <span className="text-muted">
                  &#8226; {user.friends.length} Friends
                </span>
              </div>
            </div>
            {user.id !== loggedInUser.id && (
              <button
                id={index}
                style={{
                  backgroundColor: "#ADD8E6",
                  height: "40px",
                  width: "40px",
                }}
                className={`rounded-circle btn  ${
                  followStatus[user.id] ? " mb-1 ms-2" : " ms-2"
                }`}
                onClick={() => toggleFollow(user.id)}
              >
                {followStatus[user.id] ? (
                  <img
                    width={"15px"}
                    className="mb-1"
                    src={process.env.PUBLIC_URL + "/delete-user.png"}
                    alt="Delete User"
                  />
                ) : (
                  <img
                    width={"15px"}
                    className="mb-1"
                    src={process.env.PUBLIC_URL + "/add-user.png"}
                    alt="Add User"
                  />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
