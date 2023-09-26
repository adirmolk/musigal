import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductLoading from "../customFunctions/ProductLoading";

const ProductPost = ({ userId }) => {
  const [postProducts, setPostProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const [authenticatedUserId, setAuthenticatedUserId] = useState("");
  const navigate = useNavigate();

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
      setAuthenticatedUserId(user._id);
      setUser((prevUsers) => ({ ...prevUsers, [userId]: user }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const ShowProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/products", {
        headers: { "x-api-key": localStorage.getItem("token") },
      });

      for (const product of data) {
        fetchUserProfile(product.user_id);
      }

      setTimeout(() => {
        setPostProducts(data);
      }, 1500);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
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

  return (
    <div>
      {postProducts.length === 0 ? (
        <div className="text-center" style={{ width: "450px" }}>
          <ProductLoading />
        </div>
      ) : (
        postProducts.map((item, index) => (
          // Add a conditional check here to show products only if userId matches
          (userId && item.user_id === userId) || !userId ? (
            <div
              className="mt-4 mx-4 rounded p-2"
              style={{
                width: "",
                backgroundColor: "white",
              }}
              key={index}
            >
              <div className="d-flex p-2 justify-content-between">
                <div className="d-flex align-items-center ms-1">
                  <img
                    src={
                      user[item.user_id].imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "48px", height: "48px" }}
                  />
                  <div className="mx-2">
                    <h5
                      onClick={() => navigate(`/profiles/${item.user_id}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {user && user[item.user_id]
                        ? user[item.user_id].name
                        : "Unknown User"}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      {user && user[item.user_id]
                        ? user[item.user_id].level >= 150
                          ? "Pro "
                          : user[item.user_id].level >= 50
                          ? "Maxim "
                          : "Noob "
                        : "Unknown Level"}
                      <span style={{ fontSize: "14px" }} className="text-muted">
                        &#8226; {user[item.user_id].friends.length} Friends
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded">
                <img
                  className="rounded mb-1"
                  src={item.img_url}
                  alt={`${item.title} Album Cover`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px 10px 0 0",
                    border: "lightgray 1px solid",
                  }}
                />
                <br />
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
          ) : null
        ))
      )}
    </div>
  );
};

export default ProductPost;
