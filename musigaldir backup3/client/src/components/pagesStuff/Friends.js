import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Friends = () => {
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
            "http://localhost:3001/users/profile",
            {
              headers: {
                "x-api-key": token,
              },
            }
          );
          setUser(response.data);
          console.log(response.data);
          friendsGet(response.data._id); // Fetch friends after getting the user data
          setLoggedInUser(response.data)
        } catch (error) {
          console.error(error);
        }
      }
    };

    getProfile();
  }, [navigate]);

  const friendsGet = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/friends/${userId}`
      );
      console.log(response.data.friendsArr);
      setFriends(response.data.friendsArr);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  const toggleFollow = async (id) => {
    try {
      if (isFollowed) {
        // User is currently following, so remove the friend
        const response = await axios.patch(
          `http://localhost:3001/users/addRemoveFriend/${loggedInUser._id}/${id}`,
          {},
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(false);
          // You might want to update the friends list here
        } else {
          console.log("Failed to remove friend.");
        }
      } else {
        // User is not currently following, so add the friend
        const response = await axios.patch(
          `http://localhost:3001/users/addRemoveFriend/${loggedInUser._id}/${id}`,
          {},
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(true);
          // You might want to update the friends list here
        } else {
          console.log("Failed to add friend.");
        }
      }
      navigate(0)
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (loggedInUser && user) {
      const followStatusCopy = { ...followStatus };
      friends.forEach((friend) => {
        // Set follow status for each friend
        followStatusCopy[friend._id] = loggedInUser.friends.includes(friend._id);
      });
      setFollowStatus(followStatusCopy);
    }
  }, [loggedInUser, user, friends]);

  return (
    <div  className=""  >
      {user ? (
        
        friends.length > 0 ? (
          <div className="bg-light p-2 rounded mt-4 ">
            <h5 className="ms-1">Friends List</h5>
            {friends.map((friend, index) => (
              <div
                className="d-flex justify-content-between mt-2 mb-1 p-2 rounded"
                style={{
                  width: "",
                  backgroundColor: "",
                }}
                key={friend._id}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={friend.imgUrl||"https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-3">
                    <h5
                      onClick={() => navigate(`/profiles/${friend._id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {friend.name}
                    </h5>
                    <span style={{fontSize:"14px"}} className="text-muted mb-0">
                      {friend.level >= 150
                        ? "Pro "
                        : friend.level >= 50
                        ? "Maxim "
                        : "Noob "}
                    </span>
                    <span style={{fontSize:"14px"}}className="text-muted">
                      &#8226; {friend.friends.length} Friends
                    </span>
                  </div>
                </div>
                <button
  id={index}
  style={{ backgroundColor: "#ADD8E6" }}
  className={`rounded-circle btn${
    followStatus[friend._id] ? " mb-1 ms-2" : " ms-2"
  }`}
  onClick={() => toggleFollow(friend._id)}
>
  {followStatus[friend._id] ? (
    <img width={"18px"} className="mb-1" src={process.env.PUBLIC_URL + "/delete-user.png"} alt="Delete User" />
  ) : (
    <img width={"18px"} src={process.env.PUBLIC_URL + "/add-user.png"} alt="Add User" />
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
