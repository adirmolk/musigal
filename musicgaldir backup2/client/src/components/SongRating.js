import React, { useState, useEffect } from "react";
import axios from "axios";

const SongRating = ({ songId, userId, userLevel, updateLevel }) => {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0); 
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
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [songId]);

  const handleRatingChange = async (event) => {
    const newRating = parseInt(event.target.value);

    try {
      const response = await axios.put(
        `http://localhost:3001/songs/rating/${songId}`,
        {
          rating: newRating,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );

      setSelectedRating(newRating);
      localStorage.setItem("rating", newRating);
      setRated(true);

      if (updateLevel) {
        updateLevel(response.data.level, response.data.totalPoints);
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div>
      {rated ? (
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
          <select
            style={{ width: "70px" }}
            className="form-select mt-2"
            value={rating}
            onChange={handleRatingChange}
          >
            <option value="">&#10084;</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button
            style={{
              fontWeight: "bold",
              color: "black",
            }}
            className="btn border ms-1 mt-2"
          >
            {totalPoints} <span>Ratings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SongRating;
