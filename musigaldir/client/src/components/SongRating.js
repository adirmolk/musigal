import React, { useState, useEffect } from "react";

const SongRating = ({ songId }) => {
  const [rating, setRating] = useState("");

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleResetRating = () => {
    setRating("");
  };

  useEffect(() => {
    // Check if a rating is stored for this songId in localStorage
    const storedRating = localStorage.getItem(`songRating_${songId}`);
    if (storedRating !== null) {
      setRating(storedRating);
    }
  }, [songId]);

  useEffect(() => {
    // Store the rating in localStorage whenever it changes
    if (rating !== "") {
      localStorage.setItem(`songRating_${songId}`, rating);
    }
  }, [songId, rating]);

  return (
    <div>
      {!rating ? (
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
      ) : (
        <div>
          <button
            style={{ fontWeight: "bold" }}
            className="btn bg-light  ml-2 mx-4 "
            onClick={handleResetRating}
          >
            {rating}
            <br />
                      </button>
        </div>
      )}
    </div>
  );
};

export default SongRating;
