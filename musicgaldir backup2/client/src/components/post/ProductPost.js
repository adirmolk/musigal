import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import SkullLoading from "../customFunctions/SkullLoading";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  color: black;
`;

const ProductPost = () => {
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
      }, 2000);
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
      {postProducts.length === 0 ? ( // Display the Loading component when postProducts is empty
        <div className="text-center">
          <SkullLoading />
        </div>
      ) : (
        postProducts.map((item, index) => (
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
                    onClick={() => navigate(`/profiles/${item.user_id}`)}
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
        ))
      )}
    </div>
  );
};

export default ProductPost;
