import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CurrentlyPlaying from "../spotify/CurrentlyPlaying";
import Post from "../post/Post";
import FriendsList from "../spotify/FriendsList";
import PostArea from "../post/PostArea";
import Nav from "../pagesStuff/Nav";
import BgColor from "../customFunctions/BgColor";

const ProfilesErea = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postProducts, setPostProducts] = useState([]); // Initialize as an empty array
  const backgroundColor = BgColor();
  const { userId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/64f1bf53c56650f5bc9b783d`)
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
        `http://localhost:3001/products/user/64f1bf53c56650f5bc9b783d`
      );
      console.log(data);
      setPostProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ShowProducts();
  }, []);

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
                  {/* <div>
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
                )} */}
                </div>
              </div>
            ))}
            <PostArea />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default ProfilesErea;
