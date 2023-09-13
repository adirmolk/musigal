import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../pagesStuff/Nav";
import BgColor from "../customFunctions/BgColor";
import SongRating from "../customFunctions/SongRating";

const ProfilesErea = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postProducts, setPostProducts] = useState([]);
  const [postSongs, setPostSongs] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const backgroundColor = BgColor();
  const [postType, setPostType] = useState("song");
  const [togglePost, setTogglePost] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const ShowProducts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/products/user/${id}`
      );
      console.log(data);
      setPostProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ShowSongs = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/songs/user/${id}`
      );

      setPostSongs(data);
      setTimeout(() => {
        setPostSongs(data);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    ShowProducts();
    ShowSongs();
  }, []);
  const toggleDescription = (index) => {
    if (index === openDescriptionIndex) {
      setOpenDescriptionIndex(null);
    } else {
      setOpenDescriptionIndex(index);
    }
  };

  return (
    <div>
      <div>
        <Nav />
        {user ? (
          <div className="" style={{ backgroundColor: "#EEEDEF" }}>
            <div
              style={{ backgroundColor: backgroundColor }}
              className="d-flex p-5 "
            >
              <div className="d-flex ms-5 ">
                <img
                  width={"100px"}
                  className="rounded-circle"
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Sade_-_Love_Deluxe.png/220px-Sade_-_Love_Deluxe.png"
                  alt="User Avatar"
                />
                <div className="ms-2 mt-3">
                  <h2>{user.name}</h2>
                  <div className="d-flex">
                    <p className="text-muted me-1 mb-0">
                      {user.level >= 150
                        ? "Pro"
                        : user.level >= 50
                        ? "Maxim"
                        : "Noob"}
                    </p>{" "}
                    &#8226;
                    <span className=" text-muted ms-1">
                      {" "}
                      {user.friends.length} friends
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {" "}
              <div
                className="rounded  btn text-center  ms-4"
                onClick={() => setPostType("song")}
                style={{
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
                  backgroundColor:
                    postType === "product" ? "lightblue" : "white",
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
            </div>

            {postType === "song" ? (
              <div>
                {postSongs.map((song, index) => (
                  <div
                    className="mt-4 mx-4 p-2 rounded"
                    style={{
                      backgroundColor: "white",
                      width: "400px",
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
                            {user ? user.name : "Unknown User"}
                          </h4>
                          <p className="text-muted mb-0">
                            {user
                              ? user.level >= 150
                                ? "Pro"
                                : user.level >= 50
                                ? "Maxim"
                                : "Noob"
                              : "Unknown Level"}
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
                      {/* {user && user[song.user_id] ? (
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
                      )} */}

                      <p style={{}} className=" d-inline fw-bold mt-3">
                        {user ? user.name : "Unknown User"}
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
                          <h4 style={{ cursor: "pointer", margin: "0" }}>
                            {user ? user.name : "Unknown User"}
                          </h4>
                          <p className="text-muted mb-0">
                            {user
                              ? user.level >= 150
                                ? "Pro"
                                : user.level >= 50
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
                      <span style={{}}> {item.condition} </span>
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
                          {showDescription
                            ? "Hide Description"
                            : "See Description"}
                        </button>
                      </div>
                      {openDescriptionIndex === index && (
                        <div className="text-center mt-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1>user not found</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilesErea;
