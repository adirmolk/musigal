import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus, FaArrowCircleDown } from "react-icons/fa";
import DeezerSearch from "../deezer/DeezerSearch";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const VinylWall = () => {
  const [vinylWall, setVinylWall] = useState([]);
  const [showDeezerSearch, setShowDeezerSearch] = useState(false);
  const [albumTitleFromDeezer, setAlbumTitleFromDeezer] = useState({});
  const [isAddVinyl, setIsAddVinyl] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const { id } = useParams();
  const record = vinylWall[0];
  const [displayedVinyls, setDisplayedVinyls] = useState(8);
  const vinylsPerPage = Infinity;
  const reversedVinylWall = [...vinylWall].reverse();
  const vinylWallSlice = showAll
    ? reversedVinylWall
    : reversedVinylWall.slice(0, displayedVinyls);

  const renderVinyl = async () => {
    const data = await axios.get(`http://localhost:3001/api/vinyl/user/${id}`, {
      headers: { "x-api-key": localStorage.getItem("token") },
    });
    setVinylWall(data.data);
  };

  const handleShowMore = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const postVinyl = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/vinyl",
        albumTitleFromDeezer,
        {
          headers: {
            "x-api-key": localStorage.getItem("token"),
          },
        }
      );
      toast.success("Post vinyl successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error posting vinyl!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const fetchLoggedInUser = async () => {
    const data = await axios.get(`http://localhost:3001/api/users/profile`, {
      headers: {
        "x-api-key": localStorage.getItem("token"),
      },
    });
    setLoggedInUser(data.data);
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, [id]);

  useEffect(() => {
    renderVinyl();
    setIsAddVinyl(false);
  }, [isAddVinyl]);

  const onAddVinyl = () => {
    setShowDeezerSearch(true);
  };

  const handleAlbumTitleChange = (albumTitle, albumImg_url, album_artist) => {
    setAlbumTitleFromDeezer({
      title: albumTitle,
      artist: album_artist,
      imgUrl: albumImg_url,
      userId: loggedInUser.id,
    });
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
        className="instagram-post p-3 me-2 rounded"
        style={{
          marginBottom: "20px",
          position: "relative",
          borderRadius: "10px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          backgroundColor: "white",
        }}
      >
        {vinylWallSlice.length > 0 ? (
          vinylWallSlice.map((record, index) => (
            <div
              key={index}
              style={{
                width: "20%",
                textAlign: "center",
                margin: "10px",
                position: "relative",
              }}
              className="text-center ms-2"
            >
              <img
                className="rounded"
                src={record.imgUrl}
                alt={`${record.title} Album Cover`}
                style={{
                  width: "100%",
                  maxWidth: "",
                  borderRadius: "10px",
                  border: "lightgray 1px solid",
                }}
              />
              <div
                className="text-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "#DDC7A9",
                  maxHeight: "40px",
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
          ))
        ) : (
          <span>There aren't any vinyls to see here.</span>
        )}
      </div>

      {showDeezerSearch && (
        <div className="row">
          <div className="col-12 mb-3 mt-2">
            <DeezerSearch onAlbumTitleChange={handleAlbumTitleChange} />
          </div>
        </div>
      )}
      <div style={{ display: "flex" }}>
        {vinylWall.length > 0 && (
          <div className="d-flex">
            <button
              className="btn btn-outline-primary mt-2 "
              onClick={handleShowMore}
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        )}
        {loggedInUser?.id == id && (
          <div className="mt-2 ms-3">
            <button
              className="btn btn-outline-primary"
              style={{
                width: "",
                height: "",
                display: loggedInUser ? "inline" : "none",
              }}
              onClick={onAddVinyl}
            >
              <FaPlus size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VinylWall;
