import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../pagesStuff/Nav";
import VinylWall from "./VinylWall";
import EditProfile from "./EditProfile";
import SongPost from "../post/SongPost";
import ProductPost from "../post/ProductPost";

const ProfilesErea = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [postType, setPostType] = useState("song");
  const [isFollowed, setIsFollowed] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get(`http://localhost:3001/users/${id}`)
        .then((response) => {
          setUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchLoggedInUser = async () => {
      const { data } = await axios.get(`http://localhost:3001/users/profile`, {
        headers: {
          "x-api-key": localStorage.getItem("token"),
        },
      });
      console.log(data._id);
      setLoggedInUser(data);
      console.log("Logged: ", loggedInUser);
    };
    fetchUser();
    fetchLoggedInUser();
  }, []);

  const toggleFollow = async () => {
    try {
      if (isFollowed) {
        const response = await axios.patch(
          `http://localhost:3001/users/addRemoveFriend/${loggedInUser._id}/${id}`,
          {},
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(false);
        } else {
          console.log("Failed to remove friend.");
        }
      } else {
        const response = await axios.patch(
          `http://localhost:3001/users/addRemoveFriend/${loggedInUser._id}/${id}`,
          {},
          {
            headers: { "x-api-key": localStorage.getItem("token") },
          }
        );
        if (response.status === 200) {
          setIsFollowed(true);
        } else {
          console.log("Failed to add friend.");
        }
      }
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleEditProfile = () => {
    setEditProfileOpen(!isEditProfileOpen);
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.friends.includes(user._id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [loggedInUser, user]);

  return (
    <div>
      <Nav />

      {user ? (
        <div style={{ backgroundColor: "#EEEDEF" }}>
          <div className="container">
            <div className="row">
              <div className="col-12 order-1 ">
                <div
                  style={{ backgroundColor: "rgb(247, 229, 205)" }}
                  className="rounded align-items-start flex-column p-3"
                >
                  <img
                    width="100px"
                    height="100px"
                    className="rounded-circle mb-3 ms-5"
                    src={
                      user.imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="User Avatar"
                  />
                  <h2 className="mb-2 ms-5">
                    {user.name}
                    {loggedInUser?._id === id ? (
                      <div className="d-inline">
                        {" "}
                        <button
                          className="btn mb-1"
                          onClick={toggleEditProfile}
                        >
                          <img
                            width="15px"
                            src={process.env.PUBLIC_URL + "/edit.png"}
                            alt="Edit"
                          />
                        </button>
                        {isEditProfileOpen && <EditProfile />}
                      </div>
                    ) : (
                      <button
                        className={`btn ${
                          isFollowed
                            ? "btn-danger ms-2 mb-2"
                            : "ms-2 mb-2 btn-light"
                        }`}
                        onClick={toggleFollow}
                      >
                        {isFollowed ? (
                          <img
                            width="18px"
                            src={process.env.PUBLIC_URL + "/delete-user.png"}
                            alt="Unfollow"
                          />
                        ) : (
                          <img
                            width="15px"
                            src={process.env.PUBLIC_URL + "/add-user.png"}
                            alt="Follow"
                          />
                        )}
                      </button>
                    )}
                  </h2>

                  <div className="d-flex ms-5">
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
                      {user.friends.length} Friends
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{ backgroundColor: "" }}
                className="col-lg-4 col-md-12 order-2"
              >
                <div className="mt-4 ms-4">
                  <div
                    className="rounded btn text-center"
                    onClick={() => setPostType("song")}
                    style={{
                      backgroundColor:
                        postType === "song" ? "lightblue" : "white",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/musicnote.png"}
                      alt="Song 1"
                      style={{
                        marginBottom: "2px",
                        width: "17px",
                        height: "15px",
                      }}
                    />
                    <span style={{ fontSize: "16px" }} className="m-2">
                      Posts
                    </span>
                  </div>
                  <div
                    className="rounded btn text-center "
                    onClick={() => setPostType("product")}
                    style={{
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
               loggedInUser && (loggedInUser._id === id || isFollowed) ? (
                <div>
                  <SongPost userId={id} />
                </div>
              ) : (
                <div className="mt-4 ms-4 text-center">
                  <img
                    className="text-center"
                    width="30px"
                    src={process.env.PUBLIC_URL + "/lock.png"}
                    alt="Lock Icon"
                  />
                  <h6>You need to friend {user.name} to see his posts</h6>
                </div>
              )
                ) : (
                  <div>
                    <ProductPost userId={id} />
                  </div>
                )}
              </div>
              <div className="col-lg-6 offset-md-2 col-md-12 order-3">
                <div className="mt-5">
                  <VinylWall />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>user not found</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilesErea;
