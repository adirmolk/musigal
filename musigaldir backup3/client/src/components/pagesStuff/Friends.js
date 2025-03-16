import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../EventBus/eventBus";

const Friends = ({ color }) => {
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [followStatus, setFollowStatus] = useState({}); // Track follow status for each friend

  const navigate = useNavigate();

  useEffect(() => {
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
          console.log(response.data);
          friendsGet(response.data.id); // Fetch friends after getting the user data
          setLoggedInUser(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    getProfile();
  }, [navigate]);

  // Fetch friends list
  const friendsGet = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/friends?userId=${userId}`
      );
      console.log(response.data);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Toggle follow/unfollow friend
  const toggleFollow = async (targetUserId) => {
    try {
      if (isFollowed) {
        // User is currently following, so remove the friend
        const response = await axios.put(
          "http://localhost:3001/api/users/follow", // No query params
          { userId: loggedInUser.id, targetUserId }, // Send both IDs in the body
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(false);
        } else {
          console.log("Failed to remove friend.");
        }
      } else {
        // User is not currently following, so add the friend
        const response = await axios.put(
          "http://localhost:3001/api/users/unfollow", // No query params
          { userId: loggedInUser.id, targetUserId }, // Send both IDs in the body
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );

        if (response.status === 200) {
          setIsFollowed(true);
        } else {
          console.log("Failed to add friend.");
        }
      }

      // Emit event to notify others that the friends list has changed
      eventBus.emit("friendsUpdated", targetUserId);
    } catch (error) {
      console.log(error);
    }
  };

  // Listen for the event to refresh the friends list
  useEffect(() => {
    // Re-fetch friends list when the friendsUpdated event is emitted
    const handleFriendsUpdated = () => {
      if (loggedInUser) {
        friendsGet(loggedInUser.id); // Re-fetch the friends list
      }
    };

    eventBus.on("friendsUpdated", handleFriendsUpdated);

    // Cleanup the event listener when the component is unmounted
    return () => {
      eventBus.off("friendsUpdated", handleFriendsUpdated);
    };
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && user) {
      const followStatusCopy = { ...followStatus };
      friends.forEach((friend) => {
        // Set follow status for each friend
        console.log(followStatusCopy[friend.id]);
        console.log(loggedInUser.friends.includes(friend.id.toString()));
        console.log(loggedInUser.friends);

        followStatusCopy[friend.id] = loggedInUser.friends.includes(
          friend.id.toString()
        );
        console.log(followStatusCopy);
      });
      setFollowStatus(followStatusCopy);
    }
  }, [loggedInUser, user, friends]);
  return (
    <div>
      {user ? (
        friends.length > 0 ? (
          <div
            style={{ backgroundColor: color }}
            className=" p-2 rounded mt-4 "
          >
            <h5 className="ms-1">Friends List</h5>
            {friends.map((friend, index) => (
              <div
                className="d-flex justify-content-between mt-2 mb-1 p-2 rounded"
                style={{
                  width: "",
                  backgroundColor: "",
                }}
                key={friend.id}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={
                      friend.imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-3">
                    <h5
                      onClick={() => navigate(`/profiles/${friend.id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {friend.name}
                    </h5>
                    <span
                      style={{ fontSize: "14px" }}
                      className="text-muted mb-0"
                    >
                      {friend.level >= 150
                        ? "Pro "
                        : friend.level >= 50
                        ? "Maxim "
                        : "Noob "}
                    </span>
                    <span style={{ fontSize: "14px" }} className="text-muted">
                      &#8226; {friend.friends.length} Friends
                    </span>
                  </div>
                </div>
                <button
                  id={index}
                  style={{ backgroundColor: "#ADD8E6" }}
                  className={`rounded-circle btn${
                    followStatus[friend.id] ? " mb-1 ms-2" : " ms-2"
                  }`}
                  onClick={() => toggleFollow(friend.id)}
                >
                  {followStatus[friend.id] ? (
                    <img
                      width={"18px"}
                      className="mb-1"
                      src={process.env.PUBLIC_URL + "/delete-user.png"}
                      alt="Delete User"
                    />
                  ) : (
                    <img
                      width={"18px"}
                      src={process.env.PUBLIC_URL + "/add-user.png"}
                      alt="Add User"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>No friends to display.</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Friends;
