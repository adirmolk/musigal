import axios from "axios";
import React, { useEffect, useState } from "react";
import SongRating from "./SongRating";
import { useNavigate } from "react-router-dom";
import Post from "./Post";

const PostArea = () => {
  const [postSongs, setPostSongs] = useState([]);
  const [postProducts, setPostProducts] = useState([]);
  const [postType, setPostType] = useState("song");
  const [showDescription, setShowDescription] = useState(false);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const token = localStorage.getItem("token");
  const [togglePost, setTogglePost] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authenticatedUserId, setAuthenticatedUserId] = useState("");
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/profile/${userId}`,
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      const user = response.data;
      // console.log(response.data);
      setAuthenticatedUserId(user._id);
      setUser((prevUsers) => ({ ...prevUsers, [userId]: user }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const ShowProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        headers: { "x-api-key": token },
      });
      console.log(data);

      for (const product of data) {
        fetchUserProfile(product.user_id);
      }

      setPostProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ShowSongs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/songs", {
        headers: { "x-api-key": token },
      });
      console.log(data);

      for (const song of data) {
        fetchUserProfile(song.user_id);
      }

      setPostSongs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ShowSongs();
    ShowProducts();
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

  const showPost = () => {
    setTogglePost(!togglePost);
  };
  const updateLevel = (newLevel) => {
    setUserLevel(newLevel);
  };

  return (
    <div style={{ marginTop: togglePost ? "0" : "25px" }} className="">
      <div style={{ display: togglePost ? "block" : "none" }}>
        <Post />
      </div>

      <div
        className="rounded  btn text-center ms-4"
        onClick={() => setPostType("song")}
        style={{
          // border: "lightgray 1px solid",
          display: togglePost ? "none" : "inline",
          backgroundColor:
            postType === "song" ?? !togglePost ? "lightblue" : "white",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/musicnote.png"}
          alt="Song 1"
          className=""
          style={{ marginBottom: "2px", width: "17px", height: "15px" }}
        />
        <span style={{ fontSize: "16px" }} className="m-2">
          Posts
        </span>
      </div>
      <div
        className="rounded btn text-center ms-2"
        onClick={() => setPostType("product")}
        style={{
          display: togglePost ? "none" : "inline",
          // border: "lightgray 1px solid",
          backgroundColor: postType === "product" ? "lightblue" : "white",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/item.png"}
          alt="Song 2"
          className="mb-1"
          style={{ width: "16px", height: "16px" }}
        />
        <span style={{ fontSize: "16px" }} className="m-2">
          Shop
        </span>
      </div>
      <div
        className="rounded btn text-center  "
        onClick={() => showPost()}
        style={{
          marginLeft: togglePost ? "25px" : "7px",
          height: "36px",
          border: "lightgray 1px solid",
          backgroundColor: togglePost === true ? "lightblue" : "#EEEDEF",
        }}
      >
        <span style={{ color: "gray" }} className="fw-bold ">
          +
        </span>
        <span style={{ fontSize: "14px" }} className="m-2">
          Upload
        </span>
      </div>
      {postType === "song" ? (
        <div>
          {postSongs.map((song, index) => (
            <div
              className="mt-4 mx-4 p-2 rounded"
              style={{
                backgroundColor: "white",
                width: "400px",
                // border: "lightgray 1px solid",
              }}
              key={index}
            >
              <div className="p-2 justify-content-evenly">
                <div className="d-flex align-items-center">
                  <img
                    src="https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="mx-3">
                    <h4
                      onClick={() => navigate(`/profile/${song.user_id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user && user[song.user_id]
                        ? user[song.user_id].name
                        : "Unknown User"}
                    </h4>
                    <p className="text-muted mb-0">
                      {user && user[song.user_id]
                        ? user[song.user_id].level >= 150
                          ? "Pro"
                          : user[song.user_id].level >= 50
                          ? "Maxim"
                          : "Noob"
                        : "Unknown Level"}
                    </p>
                  </div>
                  {/* <button
                    style={{ backgroundColor: "#DDC7A9" }}
                    className="btn ms-5"
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/add-user.png"}
                      alt="Song 2"
                      className="mb-1"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </button> */}
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
                {user && user[song.user_id] ? (
                  //  && user[song.user_id]._id !== authenticatedUserId
                  <SongRating
                    songId={song._id}
                    userId={user[song.user_id]._id}
                    user={user}
                    userLevel={userLevel}
                    updateLevel={(newLevel) => {
                      setUserLevel(newLevel);
                    }}
                  />
                ) : (
                  <p className="mt-2">You cant rank your own song.</p>
                )}

                <p style={{}} className=" d-inline fw-bold mt-3">
                  {user && user[song.user_id]
                    ? user[song.user_id].name
                    : "Unknown User"}
                </p>
                <p
                  style={{
                    maxWidth: "400px",
                    height: "auto",
                    overflow: "hidden",
                  }}
                  className=""
                >
                  {" "}
                  {song.description}
                </p>
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
                width: "432px",
                backgroundColor: "white",
                // border: "lightgray 1px solid",
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
                      onClick={() => navigate(`/profile/${item.user_id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user && user[item.user_id]
                        ? user[item.user_id].name
                        : "Unknown User"}
                    </h4>
                    <p className="text-muted mb-0">
                      {user && user[item.user_id]
                        ? user[item.user_id].level >= 150
                          ? "Pro"
                          : user[item.user_id].level >= 50
                          ? "Maxim"
                          : "Noob"
                        : "Unknown Level"}
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
                    border: "lightgray 1px solid",
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
                    className="ms-2 btn mt-1"
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
