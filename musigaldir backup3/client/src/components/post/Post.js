import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import Nav from "../pagesStuff/Nav";
import checkTokenValidation from "../users/checkTokenValidation";
import { useUser } from "../users/UserContext";

const Post = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [postType, setPostType] = useState("song");
  const [product, setProduct] = useState({});
  const [song, setSong] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const user = useUser();
  // console.log(user)

  const onPlay = () => {
    setSong({
      ...song,
      title: selectedSong.title,
      album: selectedSong.album.title,
      artist: selectedSong.artist.name,
      img_url: selectedSong.album.cover_medium,
    });
  };
  const onPost = async () => {
    setIsPosted(false);
    const tokenValid = checkTokenValidation();

    if (tokenValid) {
      setIsLoading(true);

      try {
        if (postType !== "song") {
          console.log(product);
          const response = await axios.post(
            "http://localhost:3001/products",
            product,
            {
              headers: {
                "x-api-key": localStorage.getItem("token"),
              },
            }
          );
          console.log(response.data);
        } else {
          console.log(song);
          const response = await axios.post(
            "http://localhost:3001/songs",
            song,
            {
              headers: {
                "x-api-key": localStorage.getItem("token"),
              },
            }
          );
          console.log(response.data);
        }

        setIsPosted(true);

        setTimeout(() => {
          setIsLoading(false);
          navigate(0);
        }, 1000);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  const fetchDeezerData = async () => {
    const options = {
      method: "GET",
      url: "https://deezerdevs-deezer.p.rapidapi.com/search",
      params: { q: searchQuery },
      headers: {
        "X-RapidAPI-Key": "f2954e8161mshe367dd9c79a3865p17b030jsnd10838d0ffa3",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.data);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeezerData();
  }, [searchQuery]);

  const debouncedFetchDeezerData = _.debounce(fetchDeezerData, 500);

  const handlePlayButtonClick = (result) => {
    if (isPlaying) {
      audioRef.current.pause();
    }
    setSelectedSong(result);
    audioRef.current = new Audio(result.preview);
    audioRef.current.play();
    setSearchQuery("");
    setIsPlaying(true);
  };

  useEffect(() => {
    if (selectedSong) {
      onPlay();
    }
  }, [selectedSong]);

  return (
    <div>
      <div className="d-flex flex-column  p-4">
        <div
          style={{
            backgroundColor: "white",
            width: "405px",
            //  border: "lightgray 1px solid"
          }}
          className="p-3 rounded"
        >
          <div>
            {" "}
            <img
              width={"50px"}
              height={"50px"}
              className="ms-2 rounded-circle mb-1"
              src={
                user?.imgUrl ||
                "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
              }
              alt="User Profile"
              style={{ display: postType === "song" ? "inline" : "none" }}
            />
            {postType === "song" ? (
              <input
                className="ms-3 rounded-pill border w-75 p-2"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Post Song"
                style={{
                  backgroundColor: "#EEEDEF",
                  fontSize: "15px",
                  display: postType === "song" ? "inline" : "none",
                }}
              />
            ) : (
              <div className="d-flex align-items-center">
                <img
                  width={"50px"}
                  height={"50px"}
                  className="ms-2 rounded-circle mb-1"
                  src={
                    user?.imgUrl ||
                    "https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_1920,f_auto/A-Alamy-BXWK5E_vvmkuf.jpg"
                  }
                  alt="User Profile"
                />
                <h2 style={{ color: "#DDC7A9" }} className="d-inline  mx-3 ">
                  Post Product
                </h2>
              </div>
            )}
            <hr />
          </div>

          <div
            style={{ width: "400px", margin: "0 auto" }}
            className="text-center p-2"
          >
            {searchResults && (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="rounded"
                    style={{
                      backgroundColor: "#DDC7A9",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      className="rounded"
                      style={{
                        width: "70px",
                        height: "70px",
                        marginRight: "10px",
                      }}
                      src={result.album.cover_small}
                      alt={`${result.title} Album Cover`}
                    />

                    <div className="mt-2" style={{ flex: 1 }}>
                      <p
                        className="ms-2 d-inline mb-0"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {result.title} &#8226;
                      </p>
                      <p
                        className="d-inline ms-1"
                        style={{
                          minWidth: 0,
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {result.artist.name}
                      </p>
                      <p className="ms-1">
                        <span className="text-muted">
                          💿{result.album.title} &#8226;{" "}
                        </span>
                        <button
                          onClick={() => {
                            handlePlayButtonClick(result);
                          }}
                          className="btn"
                        >
                          <img
                            width={"20px"}
                            height={"20px"}
                            src={process.env.PUBLIC_URL + "/play.png"}
                            alt="Play"
                          />
                        </button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {postType === "song" ? (
              selectedSong && (
                <div>
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
                      className="rounded"
                      src={selectedSong.album.cover_medium}
                      alt={`${selectedSong.title} Album Cover`}
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
                        {selectedSong.title}
                      </p>
                      <p style={{ fontSize: "14px", margin: "0" }}>
                        {selectedSong.artist.name}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <input
                    onChange={(e) =>
                      setSong({ ...song, description: e.target.value })
                    }
                    className="w-100 rounded text-center border p-2 bg-light"
                    placeholder="add description..."
                    type="text"
                  />
                </div>
              )
            ) : (
              <div style={{ width: "356px" }} className="text-start ">
                <div className="d-flex">
                  <input
                    onChange={(e) =>
                      setProduct({ ...product, img_url: e.target.value })
                    }
                    style={{ width: "150px", height: "100px" }}
                    className=" rounded border  bg-light"
                    type="text"
                  />
                  <div className="p-2">
                    <input
                      onChange={(e) =>
                        setProduct({ ...product, title: e.target.value })
                      }
                      className=" rounded mx-1 border p-2 bg-light"
                      placeholder="Items Name"
                      type="text"
                    />
                    <input
                      onChange={(e) =>
                        setProduct({ ...product, price: e.target.value })
                      }
                      className=" rounded mx-1 mt-2 border p-2 bg-light"
                      placeholder="Items Price"
                      type="number"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <select
                    onChange={(e) =>
                      setProduct({ ...product, condition: e.target.value })
                    }
                    className="rounded border mt-2 p-2 bg-light"
                    name="itemCondition"
                    id="itemCondition"
                  >
                    <option value="" disabled selected>
                      Choose condition
                    </option>
                    <option value="Mint (M)">Mint (M)</option>
                    <option value="Near Mint (NM or M-)">
                      Near Mint (NM or M-)
                    </option>
                    <option value="Very Good Plus (VG+)">
                      Very Good Plus (VG+)
                    </option>
                    <option value="Very Good (VG)">Very Good (VG)</option>
                    <option value="Good (G)">Good (G)</option>
                    <option value="Good Plus (G+)">Good Plus (G+)</option>
                    <option value="Poor (P)">Poor (P)</option>
                    <option value="Fair (F)">Fair (F)</option>
                  </select>

                  <input
                    onChange={(e) =>
                      setProduct({ ...product, location: e.target.value })
                    }
                    style={{ width: "156px" }}
                    className=" mx-2  rounded border mt-2 p-2 bg-light"
                    placeholder="Location"
                    type="text"
                  />
                </div>

                <input
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  style={{ height: "70px", width: "360px" }}
                  className=" rounded text-center border mt-2 p-2 bg-light"
                  placeholder="Add Description..."
                  type="text"
                />
                <hr />
              </div>
            )}

            <div
              style={{
                marginTop: selectedSong !== null ? "15px" : "0",
                marginRight: "15px", // Add margin to the right side
              }}
              className="d-flex justify-content-between"
            >
              <div
                className="rounded-pill btn text-center"
                onClick={() => setPostType("song")}
                style={{
                  backgroundColor:
                    postType === "song" ? "lightblue" : "#EEEDEF",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/musicnote.png"}
                  alt="Song 1"
                  style={{ width: "16px", height: "14px" }}
                />
                <span style={{ fontSize: "12px" }} className="m-1">
                  Song
                </span>
              </div>
              <div
                className="rounded-pill btn text-center"
                onClick={() => setPostType("product")}
                style={{
                  backgroundColor:
                    postType === "product" ? "lightblue" : "#EEEDEF",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/vinyl.png"}
                  alt="Song 2"
                  style={{ width: "16px", height: "16px" }}
                />
                <span style={{ fontSize: "12px" }} className="m-2">
                  Product
                </span>
              </div>
              <button
                onClick={onPost}
                style={{
                  backgroundColor: isLoading ? "#ccc" : "#DDC7A9",
                  color: "white",
                }}
                className={`btn rounded-pill me-2 w-50 ${
                  isLoading ? "disabled" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : isPosted ? "Posted" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
