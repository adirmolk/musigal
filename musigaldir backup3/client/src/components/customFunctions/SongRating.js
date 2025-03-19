import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../users/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const SongRating = ({ songId, userId, updateLevel }) => {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [user, setUser] = useState({});
  const users = useUser();
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/songs/rating/${songId}/${userId}`,
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

        const { data } = await axios.get(
          "http://localhost:3001/api/users/profile",
          {
            headers: {
              "x-api-key": localStorage.getItem("token"),
            },
          }
        );

        setUser(data);
      } catch (error) {
        console.error("Error fetching user rating:", error);
        toast.error("Error fetching user rating!", {
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

    fetchUserRating();
  }, [songId]);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value);
    setRating(newRating);
  };

  const handleRatingMouseUp = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/songs/${songId}?userId=${userId}`,
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
        `http://localhost:3001/api/users/update/${userId}`,
        {
          rating: rating,
        },
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      toast.success("Updating rating successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Error updating rating!", {
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
  const toggleInputVisibility = () => {
    setInputVisible(!inputVisible);
  };
  return (
    <div>
      {users.id == userId ? (
        <div className=" fw-bold mt-2">
          {totalPoints}{" "}
          <img
            className="mb-1"
            width={"15px"}
            src={process.env.PUBLIC_URL + "/increase.png"}
          />
        </div>
      ) : rated ? (
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
            style={{
              backgroundColor: "#ECEBEC",
            }}
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
      )}
    </div>
  );
};

export default SongRating;
