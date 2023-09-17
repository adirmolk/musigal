import React, { useState, useEffect } from "react";
import useFriendsList from "../../hooks/useFrindsList";
import BgColor from "../customFunctions/BgColor";

const FriendsList = () => {
  const { friendsList, isLoading } = useFriendsList();
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    console.log(friendsList);
  }, [friendsList]);

  const toggleFriends = () => {
    setShowFriends(!showFriends);
  };
  const friendListScrollStyle = {
    maxHeight: "500px", // Adjust the height as needed
    overflowY: "scroll",
    border: "none",
    padding: "10px",
    backgroundColor: "",
  };

  const formatTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const friendTime = new Date(timestamp);
    const timeDifference = currentTime - friendTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference > 0) {
      return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} ${
        hoursDifference === 1 ? "hour" : "hours"
      } ago`;
    } else if (minutesDifference > 3) {
      return `${minutesDifference} ${
        minutesDifference === 1 ? "minute" : "minutes"
      } ago`;
    } else {
      return (
        <span style={{ color: "blue", fontWeight: "bold", fontSize: "14px" }}>
          now
        </span>
      );
    }
  };

  return (
    <div className="d-inline-block position-relative">
      <button
        className="btn p-2 mx-4"
        onClick={toggleFriends}
        style={{ cursor: "pointer" }}
      >
        <img
          width={"30px"}
          src="https://cdn-icons-png.flaticon.com/512/880/880594.png"
          alt="Friends"
          className=" rounded p-1"
        />
      </button>
      {showFriends && (
        <div style={{}} className="position-absolute  top-150 end-0 mt-4">
          <div style={friendListScrollStyle} className="friend-list-scroll">
            <ul className="list-group flex-column-reverse">
              {friendsList?.friends.map((friend, index) => (
                <li
                  key={index}
                  style={{}}
                  className="list-group-item  d-flex align-items-center p-3"
                >
                  <div>
                    <img
                      className="rounded-circle me-3 "
                      width={50}
                      height={50}
                      src={
                        friend.user.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                      }
                      alt={`${friend.user.name}'s profile`}
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center flex-grow-1">
                      <h6 className="me-2">{friend.user.name}</h6>
                      <span
                        style={{ fontSize: "14px" }}
                        className="text-muted mb-2"
                      >
                        {formatTimeDifference(friend.timestamp)}
                      </span>
                    </div>
                    <div
                      className="rounded  d-flex align-items-center p-2"
                      style={{ backgroundColor: BgColor(), width: "400px" }}
                    >
                      <img
                        className="rounded mb-2"
                        style={{ width: 70, height: 70, marginRight: 10 }}
                        src={friend.track.imageUrl}
                        alt={`${friend.track.name} Album Cover`}
                      />
                      <div className="flex-grow-1">
                        <p className="fw-bold mb-0">
                          {friend.track.name} • {friend.track.artist.name}
                        </p>
                        <p className="text-muted">
                          💿{friend.track.album.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
