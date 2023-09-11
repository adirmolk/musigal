import React, { useState, useEffect } from "react";
import axios from "axios";

const SongRating = ({ songId, userId, user, userLevel, updateLevel }) => {
  
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [userData, setUserData] = useState(null);
  const [selectedRating, setSelectedRating] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/profile/${userId}`,
          {
            headers: {
              "x-api-key": localStorage.getItem("token"),
            },
          }
        );
        const userProfile = response.data;
        setUserData(userProfile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleRatingChange = async (event) => {
    setSelectedRating(parseInt(event.target.value));
    localStorage.setItem('rating', parseInt(event.target.value))


    try {
      const response = await axios.put(
        `http://localhost:3001/users/update/${userId}`,
        {
          rating: selectedRating,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
        
      );

      updateLevel(response.data.level, response.data.totalPoints);

      setRated(true);
      
    } catch (error) {
      console.error("Error updating user's level:", error);
    }
  };

  return (
    <div>
      {rated ? (
        <div>
          <button
            style={{ fontWeight: "bold" }}
            className="btn bg-light ml-2 mx-4"
            disabled
          >
            {selectedRating}
            <br />
          </button>
        </div>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default SongRating;
