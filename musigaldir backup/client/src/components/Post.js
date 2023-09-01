
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import _ from "lodash";
import Nav from "./Nav";

const Post = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null); 

  const navigate = useNavigate();

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

  return (
    <div>
        {/* <Nav/> */}
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="text-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a song"
        />
        <div
          style={{ width: "400px", margin: "0 auto" }}
          className="text-center p-4"
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
                    backgroundColor: "#F0d0Ff",
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
                      className="d-inline  ms-1"
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
                        onClick={() => handlePlayButtonClick(result)}
                        className="btn "
                      >
                        <img width={"20px"} height={"20px"} src="play.png" />
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSong && (
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
          <img className="rounded"
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
            <p style={{ fontWeight: "bold", fontSize: "16px", margin: "0" }}>
              {selectedSong.title}
            </p>
            <p style={{ fontSize: "14px", margin: "0" }}>
              {selectedSong.artist.name}
            </p>
          </div>
        </div>
      )}
      <button className="btn text-bg-primary mt-3">post</button>
    </div>
    
    </div>
  );
};

export default Post;
