import React, { useState, useEffect } from "react";

const SongRating = ({ songId, user, updateLevel, updateUser }) => {
  const [rating, setRating] = useState("");
  const [rated, setRated] = useState(false);

  const handleRatingChange = (event) => {
    const selectedRating = parseInt(event.target.value);
    console.log("User object:", user); // Add this line to your handleRatingChange function

    if (user && user._id !== undefined && user.level !== undefined) {
      const levelIncrement = selectedRating;
      updateUser(user._id, user.level + levelIncrement);
      localStorage.setItem(`songRating_${songId}`, selectedRating.toString());
      updateLevel(user.level + levelIncrement);
      setRated(true);
      setRating(selectedRating);

    } else {
      console.error("User is undefined or missing _id or level property");
    }
  };

  const handleResetRating = () => {
    setRating("");
  };

  useEffect(() => {
    const storedRating = localStorage.getItem(`songRating_${songId}`);
    if (storedRating !== null) {
      setRating(parseInt(storedRating));
      setRated(true);
    }
  }, [songId]);

  return (
    <div>
      {rated ? (
        <div>
          <button
            style={{ fontWeight: "bold" }}
            className="btn  bg-light ml-2 mx-4"
            onClick={handleResetRating}
          >
            {rating}
            <br />
          </button>
        </div>
      ) : (
        <div>
          <select
          style={{width:"70px"}}
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
