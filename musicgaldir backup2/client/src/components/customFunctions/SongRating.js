import React, { useState, useEffect } from "react";
import axios from "axios";

const SongRating = ({ songId, userId, userLevel, updateLevel }) => {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [inputVisible, setInputVisible] = useState(false); // To control input visibility
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/songs/rating/${songId}`,
          {
            headers: {
              "x-api-key": localStorage.getItem("token"),
            },
          }
        );
        const { userRating, totalRating } = response.data;

        if (userRating) {
          setRating(userRating);
          setSelectedRating(userRating);
          setRated(true);
        }
        setTotalPoints(totalRating);

         const {data} = await axios.get(
          `http://localhost:3001/users/profile`,
          {
            headers: {
              "x-api-key": localStorage.getItem("token"),
            },
          }
        );
        setUser(data);

      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [songId]);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value);
    setRating(newRating);
  };

  const handleRatingMouseUp = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/songs/rating/${songId}`,
        {
          rating: rating,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );

      const { level, totalPoints } = response.data;

      setSelectedRating(rating);
      localStorage.setItem("rating", rating);
      setRated(true);

      if (updateLevel) {
        updateLevel(level, totalPoints);
      }
      await axios.put(
        `http://localhost:3001/users/update/${userId}`,
        {
          rating: rating,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const toggleInputVisibility = () => {
    setInputVisible(!inputVisible);
  };
  return (
    <div>
      {user._id == userId ? (<div className=" fw-bold mt-2">{totalPoints}  <img
              className="mb-1"
              width={"15px"}
              src={process.env.PUBLIC_URL + "/increase.png"}
            /></div>) : (
      rated ? (
        <div>
          <button
            style={{
              fontWeight: "bold",
              color:
                selectedRating >= 8
                  ? "lightgreen"
                  : selectedRating > 3
                  ? "#2DD3F7"
                  : "lightcoral",
            }}
            className="btn border mt-2"
          >
            {selectedRating}
          </button>
        </div>
      ) : (
        <div className="d-flex">
          {inputVisible && (
            <div style={{}}>
              <input
                style={{ width: "100px" }}
                type="range"
                className="form-range ms-3 mt-3 "
                min="0"
                max="10"
                value={rating}
                onChange={handleRatingChange}
                onMouseUp={handleRatingMouseUp}
              />
            </div>
          )}

          <button
            onClick={toggleInputVisibility}
            className="btn mt-2"
            style={
              {
                backgroundColor:"#ECEBEC"
              }
            }
          >
            <span
              className="fw-bold"
              style={{
                display: inputVisible ? "inline" : "none",
                fontSize: "16px",
              }}
            >
              {" "}
              {rating}
            </span>
            &#10084;
          </button>

          <span
            style={{
              display: !inputVisible ? "inline" : "none",
              marginTop: "15px",
            }}
            className="fw-bold ms-1"
          >
            {" "}
            {totalPoints}{" "}
            <img
              className="mb-1"
              width={"15px"}
              src={process.env.PUBLIC_URL + "/increase.png"}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default SongRating;
