import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeezerSearch from "../../DeezerSearch";

const VinylWall = () => {
  const [vinylWall, setVinylWall] = useState([]);
  const [showDeezerSearch, setShowDeezerSearch] = useState(false);
  const [albumTitleFromDeezer, setAlbumTitleFromDeezer] = useState({});
  const [isAddVinyl, setIsAddVinyl] = useState(false);
  const { id } = useParams();
  const record = vinylWall[0];
  const renderVinyl = async () => {
    const { data } = await axios.get(`http://localhost:3001/vinyls/user/${id}`);
    setVinylWall(data);
    console.log(data);
  };

  const postVinyl = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/vinyls",
        albumTitleFromDeezer,
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    renderVinyl();
    setIsAddVinyl(false)
  }, [isAddVinyl]);

  const onAddVinyl = () => {
    setShowDeezerSearch(true);
  };

  const handleAlbumTitleChange = (albumTitle, albumImg_url, album_artist) => {
    setAlbumTitleFromDeezer({ title: albumTitle, artist: album_artist, img_url: albumImg_url });
  };
  useEffect(() => {
    if (albumTitleFromDeezer.title) {
      postVinyl();
      setShowDeezerSearch(false);
      setIsAddVinyl(true);
    }
  }, [albumTitleFromDeezer]);

  return (
    <div>
      <h6 className="text-center">My Vinyl Wall</h6>
      <div
        className="instagram-post p-4  me-2 rounded"
        style={{
          width: "800px",
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
        <div>
          <button onClick={onAddVinyl}>Add Vinyl</button>
        </div>
        {showDeezerSearch && (
          <DeezerSearch onAlbumTitleChange={handleAlbumTitleChange} />
        )}
        {vinylWall.map((record, index) => (
          <div
            key={index}
            style={{
              width: "20%",
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
                maxWidth: "160px",
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
                {record.title}
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
