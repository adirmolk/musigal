import axios from "axios";
import React, { useEffect, useState } from "react";
import SongRating from "./SongRating";
import { useNavigate } from "react-router-dom";

const PostArea = () => {
  const [postSongs, setPostSongs] = useState([]);
  const [postProducts, setPostProducts] = useState([]);
  const [postType, setPostType] = useState("song");
  const [showDescription, setShowDescription] = useState(false);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const userId = "64f1bf53c56650f5bc9b783d";
      const response = await axios.get(`http://localhost:3001/users/${userId}`);
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const ShowSongs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/songs", {
        headers: { "x-api-key": token },
      });
      console.log(data);
      setPostSongs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const ShowProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        headers: { "x-api-key": token },
      });
      console.log(data);
      setPostProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ShowSongs();
    ShowProducts();
    fetchUserProfile();
  }, []);

  const conditionColors = {
    "Mint (M)": "green",
    "Near Mint (NM or M-)": "blue",
    "Very Good Plus (VG+)": "orange",
    "Very Good (VG)": "yellow",
    "Good (G)": "pink",
    "Good Plus (G+)": "purple",
    "Poor (P)": "red",
    "Fair (F)": "brown",
  };
  const toggleDescription = (index) => {
    if (index === openDescriptionIndex) {
      setOpenDescriptionIndex(null);
    } else {
      setOpenDescriptionIndex(index);
    }
  };

  return (
    <div>
      <div
        className="rounded-pill btn text-center"
        onClick={() => setPostType("song")}
        style={{
          backgroundColor: postType === "song" ? "lightblue" : "#EEEDEF",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/musicnote.png"}
          alt="Song 1"
          className=""
          style={{ width: "16px", height: "14px" }}
        />
        <span style={{ fontSize: "12px" }} className="m-2">
          Song
        </span>
      </div>
      <div
        className="rounded-pill btn text-center"
        onClick={() => setPostType("product")}
        style={{
          backgroundColor: postType === "product" ? "lightblue" : "#EEEDEF",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/item.png"}
          alt="Song 2"
          className=""
          style={{ width: "14px", height: "14px" }}
        />
        <span style={{ fontSize: "12px" }} className="m-2">
          Product
        </span>
      </div>
      {postType === "song" ? (
        <div>
          {postSongs.map((song, index) => (
            <div
              className="mt-4 mx-4 p-2 rounded"
              style={{
                backgroundColor: "white",
                border: "lightgray 1px solid",
              }}
              key={index}
            >
              <div className="p-2 justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-3">
                    <h4
                      onClick={() => navigate(`/profile`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user.name}
                    </h4>
                    <p className="text-muted mb-0">
                      {song.level >= 150
                        ? "Pro"
                        : song.level >= 50
                        ? "Maxim"
                        : "Noob"}
                    </p>
                  </div>
                </div>
                <hr />
                <div
                  className="instagram-post rounded"
                  style={{
                    width: "300px",
                    marginBottom: "20px",
                    position: "relative",
                    borderRadius: "10px",
                    margin: "0 auto",
                  }}
                >
                  <img
                    className="rounded mt-4"
                    src={song.img_url}
                    alt={`${song.title} Album Cover`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px 10px 0 0",
                    }}
                  />
                  <div
                    className="text-center"
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "#DDC7A9",
                      padding: "10px",
                      borderRadius: "0 0 5px 5px",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        margin: "0",
                      }}
                    >
                      {song.title}
                    </p>
                    <p style={{ fontSize: "14px", margin: "0" }}>
                      {song.artist}
                    </p>
                  </div>
                </div>
                <SongRating />

                <p
                  style={{ fontSize: "13px" }}
                  className=" d-inline-block fw-bold mt-3"
                >
                  {song.user_id}{" "}
                </p>
                <p className=" d-inline mt-3"> {song.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {postProducts.map((item, index) => (
            <div
              className="mt-4 mx-4 rounded p-2"
              style={{
                backgroundColor: "white",
                border: "lightgray 1px solid",
              }}
              key={index}
            >
              <div className="d-flex p-2 justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-3">
                    <h4
                      onClick={() => navigate(`/profile`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user.name}
                    </h4>
                    <p className="text-muted mb-0">
                      {item.level >= 150
                        ? "Pro"
                        : item.level >= 50
                        ? "Maxim"
                        : "Noob"}
                    </p>
                  </div>
                </div>
                <button
                  style={{ backgroundColor: "#DDC7A9" }}
                  className="btn badge fw-bold fs-5 h-50  mt-2 "
                >
                  +
                </button>
              </div>
              <hr />

              <div className="p-3 rounded">
                <img
                  className="rounded ms-5  mb-3 d-block"
                  src={item.img_url}
                  style={{
                    width: "300px",
                    height: "300px",
                  }}
                />
                <span className="fw-bold">{item.title} </span>&#8226;{" "}
                <span style={{ color: conditionColors[item.condition] }}>
                  {" "}
                  {item.condition}{" "}
                </span>
                <br />
                <span className="">{item.price}$ &#8226;</span>
                <span className=""> {item.location}</span>
                <br />
                <div>
                  <button
                    style={{ backgroundColor: "lightblue" }}
                    className="btn mt-1"
                  >
                    Buy
                  </button>
                  <button
                    style={{ backgroundColor: "lightblue" }}
                    onClick={() => toggleDescription(index)}
                    className="ms-2 btn "
                  >
                    {showDescription ? "Hide Description" : "See Description"}
                  </button>
                </div>
                {openDescriptionIndex === index && (
                  <div className="text-center mt-2">{item.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostArea;
