import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Nav from "./Nav";
import axios from "axios";
import Profile from "./Profile";
import _ from "lodash";


const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  let currentlyPlayingAudio;

  function playAudio(audioUrl) {
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
    }

    currentlyPlayingAudio = new Audio(audioUrl);
    currentlyPlayingAudio.play();
  }

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
      console.log(response.data.data); // Store the fetched data in searchResults state
      setSearchResults(response.data.data); // Store the fetched data in searchResults state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeezerData();
  }, [searchQuery]);
  const debouncedFetchDeezerData = _.debounce(fetchDeezerData, 500);

  

  return (
    <div>
      <Nav/>
      <Profile/>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) =>{ setSearchQuery(e.target.value)
         }

        }
        placeholder="Enter search query"
      />
      <div style={{ width: "400px" }} className="p-4">
        {searchResults &&
          searchResults.map((result) => (
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
                style={{ width: "70px", height: "70px", marginRight: "10px" }}
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
                    onClick={() => playAudio(result.preview)}
                    className="btn "
                  >
                    <img width={"20px"} height={"20px"} src="play.png" />
                  </button>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
