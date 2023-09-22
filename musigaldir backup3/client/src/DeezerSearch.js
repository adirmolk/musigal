import axios from "axios";
import React, { useEffect, useState } from "react";

const DeezerSearch = ({onAlbumTitleChange}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumImg_url, setAlbumImg_url] = useState("");
  const [album_artist, setAlbum_artist] = useState("");

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

  useEffect(() => {
    onAlbumTitleChange(albumTitle, albumImg_url, album_artist)
  }, [albumTitle])

  return (
    <div>
      <input
        className="ms-3 rounded-pill border w-75 p-2"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search an album..."
        style={{
          backgroundColor: "#EEEDEF",
          fontSize: "15px",
        }}
      />
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
                          color:"white"
                        }}
                      >
                        {result.album.title} &#8226;
                      </p>
                      <p
                        className="d-inline ms-1"
                        style={{
                          minWidth: 0,
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color:"white"
                        }}
                      >
                        {result.artist.name}
                      </p>
           <br/>
                      <button className="btn mt-2 text-bg-primary" onClick={()=>{{setAlbum_artist(result.artist.name)};{setAlbumImg_url(result.album.cover_medium)};setAlbumTitle(result.album.title);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
    </div>
    </div>
  );
};

export default DeezerSearch;
