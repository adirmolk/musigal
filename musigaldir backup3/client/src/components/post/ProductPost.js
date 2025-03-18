import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductLoading from "../customFunctions/ProductLoading";
import eventBus from "../EventBus/eventBus";

const ProductPost = ({ userId, color }) => {
  const [postProducts, setPostProducts] = useState([]);
  const [openDescriptionIndex, setOpenDescriptionIndex] = useState(null);
  const [openPhoneIndex, setOpenPhoneIndex] = useState(null);
  const navigate = useNavigate();

  const ShowProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/products", {
        headers: { "x-api-key": localStorage.getItem("token") },
      });

      setTimeout(() => {
        setPostProducts(data);
      }, 1500);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ShowProducts();
    const handleNewProduct = (newProduct) => {
      setPostProducts((prevProducts) => [newProduct, ...prevProducts]);
    };
    eventBus.on("productPosted", handleNewProduct);

    return () => {
      eventBus.off("productPosted", handleNewProduct);
    };
  }, []);

  const toggleDescription = (index) => {
    setOpenDescriptionIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const togglePhone = (index) => {
    setOpenPhoneIndex((prevIndex) => (prevIndex === index ? null : index));
  };
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
  return (
    <div>
      {postProducts.length <= 0 ? (
        <div className="text-center" style={{ width: "450px" }}>
          <ProductLoading />
        </div>
      ) : (
        postProducts.map((item, index) =>
          (userId && item.userId === userId) || !userId ? (
            <div
              className="mt-4 mx-4 rounded p-2"
              style={{ backgroundColor: color }}
              key={index}
            >
              <div className="d-flex p-2 justify-content-between">
                <div className="d-flex align-items-center ms-1">
                  <img
                    src={
                      item.user?.imgUrl ||
                      "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "48px", height: "48px" }}
                  />
                  <div className="mx-2">
                    <h5
                      onClick={() => navigate(`/profiles/${item.userId}`)}
                      style={{ cursor: "pointer", margin: "0" }}
                    >
                      {item.user?.name || "Unknown User"}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      {item.user?.level >= 150
                        ? "Pro "
                        : item.user?.level >= 50
                        ? "Maxim "
                        : "Noob "}
                      <span style={{ fontSize: "14px" }} className="text-muted">
                        &#8226; {item.user?.friends?.length || 0} Friends
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded">
                <img
                  className="rounded mb-1"
                  src={item.imgUrl}
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
                    onClick={() => togglePhone(index)}
                  >
                    Buy
                  </button>
                  <button
                    style={{ backgroundColor: "lightblue" }}
                    onClick={() => toggleDescription(index)}
                    className="ms-2 btn mt-1"
                  >
                    {openDescriptionIndex === index
                      ? "Hide Description"
                      : "See Description"}
                  </button>
                </div>
                {openDescriptionIndex === index && (
                  <div className="text-center mt-2">{item.description}</div>
                )}
                {openPhoneIndex === index && (
                  <div
                    className="text-center mt-2 p-2 border rounded"
                    style={{}}
                  >
                    <p>
                      <strong>Seller:</strong> {item.user?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {item?.phone || "No phone available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null
        )
      )}
    </div>
  );
};

export default ProductPost;
