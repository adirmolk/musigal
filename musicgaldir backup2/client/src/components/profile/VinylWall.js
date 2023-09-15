import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VinylWall = () => {
  const [vinyl, setVinyl] = useState([]);
  const { id } = useParams();
  const record = vinyl[0];

  const renderVinyl = async () => {
    const { data } = await axios.get(`http://localhost:3001/songs/user/${id}`);
    setVinyl(data);
    console.log(data);
  };
  useEffect(() => {
    renderVinyl();
  }, []);
  return (
    <div>
      <h6 className="text-center">My Vinyl Wall</h6>
      <div
        className="instagram-post p-4  me-2 rounded"
        style={{
          width: "800px", // Adjust the width to accommodate two rows of five albums each
          marginBottom: "20px",
          position: "relative",
          borderRadius: "10px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "#F7E5CD",
        }}
      >
        {vinyl.map((record, index) => (
          <div
            key={index}
            style={{
              width: "20%", // Each album takes up 20% of the container width for five albums in a row
              textAlign: "center",
              margin: "10px",
              position: "relative",
            }}
            className=""
          >
            <img
              className="rounded"
              src={record.img_url}
              alt={`${record.title} Album Cover`}
              style={{
                width: "100%",
                maxWidth: "160px", // Adjust the maximum width to make the photos smaller
                borderRadius: "10px",
              }}
            />
            <div
              className="text-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#DDC7A9",
                padding: "3px",
                borderRadius: "0 0 5px 5px",
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  margin: "0",
                }}
              >
                {record.album}
              </p>
              <p style={{ fontSize: "10px", margin: "0" }}>{record.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VinylWall;
