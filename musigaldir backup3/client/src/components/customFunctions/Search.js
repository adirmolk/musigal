import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

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
  const handleSearch = async () => {
    try {
      // Check if the search criteria is empty
      if (searchCriteria.trim() === '') {
        setSearchResults([]); // Clear the search results
        return; // Exit the function without making an API request
      }
  
      // Send a GET request to the search route with the search criteria
      const response = await axios.get(
        `http://localhost:3001/users/search?criteria=${searchCriteria}`
      );
      const users = response.data;
      setSearchResults(users);
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };
  
  const delayedSearch = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger the search after a delay (e.g., 500ms)
    const newTimeout = setTimeout(() => {
      handleSearch();
    }, 500);

    setTypingTimeout(newTimeout);
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
    delayedSearch();
    // Cleanup the timeout on component unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [searchCriteria]);
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
    <div className='ms-5'>
      <input
        type="text"
        placeholder="Search For Users..."
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        className='rounded-pill p-2 border'
      />
      <div
        className="search-results rounded mt-5"
        style={{
          position: 'absolute',
          top: '50px', // Adjust as needed for your layout
          
          right: '100px',
          width:"430px",
          maxHeight: '300px', // Set a max height for the scrollable container
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        {searchResults.map((user,index) => (
            <div
            className="d-flex justify-content-between mt-2 mb-1 p-2 rounded"
            style={{
              width: "400px",
              backgroundColor: "",
            }}
            key={user._id}
          >
            <div className="d-flex align-items-center">
              <img
                    src={user.imgUrl||"https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"}
                    alt="Profile"
                className="rounded-circle"
                style={{ width: "60px", height: "60px" }}
              />
              <div className="mx-3">
                <h3
                  onClick={() => {navigate(`/profiles/${user._id}`); navigate(0);}}
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
            <button
  id={index}
  style={{ backgroundColor: "#ADD8E6",height:"40px",width:"40px"}}
  className={`rounded-circle btn  ${
    followStatus[user._id] ? " mb-1 ms-2" : " ms-2"
  }`}
  onClick={() => toggleFollow(user._id)}
>
  {followStatus[user._id] ? (
    <img width={"15px"} className='mb-1' src={process.env.PUBLIC_URL + "/delete-user.png"} alt="Delete User" />
  ) : (
    <img width={"15px"} className='mb-1' src={process.env.PUBLIC_URL + "/add-user.png"} alt="Add User" />
  )}
</button>

                
          </div>
          
        ))}
        
      </div>
      
    </div>
  );
};

export default Search;
