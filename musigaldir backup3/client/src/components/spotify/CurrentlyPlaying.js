import React, { useEffect, useState } from "react";
import Nav from "../pagesStuff/Nav";
import axios from "axios";
import Home from "../pagesStuff/Home";

function CurrentlyPlaying() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  const refreshToken =
    "AQBEAfLkEVjLzJ8Yy46ohnfdfVhPGK9Cvw1ZpF7WV5LXSQeek_OIdEQCjQBgBu5SzcklhZpJuKYgCkfoRKHUvITtQMiTqgzBGDqa7f9k_SU00Gf9FMfgzeqlneBT6wz09Xs";
  const clientId = "009b5153b0124b80a2a7e730c72c3341";
  const clientSecret = "5589f9a8092e49f9a96fae1f43a22385";

  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const requestBody = new URLSearchParams();

  const refreshAccessToken = () => {
    requestBody.append("grant_type", "refresh_token");
    requestBody.append("refresh_token", refreshToken);

    fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => {
        const newAccessToken = data.access_token;
        setAccessToken(newAccessToken); // Store the new access token

        fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            if (data.currently_playing_type == "episode") {
              console.log("episode");
            } else if (data.currently_playing_type == "ad") {
              console.log("ad");
            } else {
              setCurrentlyPlaying(data);
            }
          })
          .catch((error) => {
            console.error("Error fetching currently playing track:", error);
          });
      })
      .catch((error) => {
        console.error("Error refreshing access token:", error);
      });
  };

  // const findTopArtist = () => {
  //   fetch("https://api.spotify.com/v1/me/top/tracks/", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.status); // Log the status code
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch top tracks");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setCurrentlyPlaying(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching top tracks:", error);
  //     });

  // };

  useEffect(() => {
    refreshAccessToken();
    // findTopArtist();

    const refreshInterval = setInterval(() => {
      refreshAccessToken();
      // findTopArtist();
    }, 20000); // Refresh every 20 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div>
      {/* <Nav /> */}
      <div className="d-flex">
        {currentlyPlaying ? (
          <div style={{ width: "330px" }} className="p-1">
            <div
              className="rounded"
              style={{
                backgroundColor: "#F0d0Ff",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <img
                className="rounded"
                style={{ width: "70px", height: "70px", marginRight: "10px" }}
                src={currentlyPlaying.item.album.images[0].url}
                alt={`${currentlyPlaying.item.name} Album Cover`}
              />
              <div className="mt-2 " style={{ flex: 1 }}>
                <p
                  className="ms-2 d-inline mb-0"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {currentlyPlaying.item.name} &#8226;
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
                  {currentlyPlaying.item.artists[0].name}
                </p>
                <p className="ms-1" style={{}}>
                  <span className="text-muted">
                    💿{currentlyPlaying.item.album.name} &#8226;{" "}
                  </span>
                  <span style={{ color: "gray" }} className="text-muted">
                    {currentlyPlaying.item.album.release_date.split("-")[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (<div style={{ width: "" }} className="">
            <div
              className="rounded text-center p-3"
              style={{
                backgroundColor: "#F0d0Ff",
                padding: "",
                width:"350px"
              }}
            >
               <p className="text-center mt-2">No track currently playing.</p>
              </div>
              </div>
         
        )}
        {/* <Home /> */}
      </div>
    </div>
  );
}

export default CurrentlyPlaying;
