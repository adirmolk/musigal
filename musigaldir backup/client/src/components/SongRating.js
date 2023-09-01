import React, { useState, useEffect } from "react";

const SongRating = ({ songId, user, updateLevel, updateUser }) => {
  const [rating, setRating] = useState("");
  const [rated, setRated] = useState(false);

  const handleRatingChange = (event) => {
    const selectedRating = parseInt(event.target.value);
    const levelIncrement = selectedRating;
    updateUser(user._id, user.level + levelIncrement);
    localStorage.setItem(`songRating_${songId}`, selectedRating.toString());
    updateLevel(user.level + levelIncrement);
    setRated(true);
    setRating(selectedRating);
  };

  const handleResetRating = () => {
    setRating(rating);
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
            className="btn bg-light ml-2 mx-4"
            onClick={handleResetRating}
          >
            {rating}
            <br />
          </button>
        </div>
      ) : (
        <div>
          <select
            className="form-select mb-3"
            value={rating}
            onChange={handleRatingChange}
          >
            <option value="">rate</option>
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
