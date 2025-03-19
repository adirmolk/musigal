import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../EventBus/eventBus";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const Friends = ({ color }) => {
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [followStatus, setFollowStatus] = useState({});

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
      // toast.success("Fetching friends successfully!", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   theme: "colored",
      // });
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Error fetching friends!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
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
      eventBus.emit("friendsUpdated", targetUserId);
    } catch (error) {}
  };

  useEffect(() => {
    const handleFriendsUpdated = () => {
      if (loggedInUser) {
        friendsGet(loggedInUser.id);
      }
      if (loggedInUser && user) {
        const followStatusCopy = { ...followStatus };
        friends.forEach((friend) => {
          followStatusCopy[friend.id] = loggedInUser.friends.includes(
            friend.id.toString()
          );
        });
        setFollowStatus(followStatusCopy);
      }
      getProfile();
    };
    eventBus.on("friendsUpdated", handleFriendsUpdated);
    return () => {
      eventBus.off("friendsUpdated", handleFriendsUpdated);
    };
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser && user) {
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
