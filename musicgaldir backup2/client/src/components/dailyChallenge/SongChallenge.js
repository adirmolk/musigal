import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DeezerSearch from "./DeezerSearch";
import { useChallenge } from "./ChallengeContext";
import { Alert, Col } from "react-bootstrap";
import { useUser } from "../users/UserContext";

const SongChallenge = () => {
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [chances, setChances] = useState(4);
  const audioRef = useRef(null);
  const [details, setDetails] = useState({});
  const { songs, correctSongIndex } = useChallenge();
  const [correctSongVisible, setCorrectSongVisible] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [correctSong, setCorrectSong] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const user = useUser();
  useEffect(() => {
    if (won || lost) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [won, lost]);

  const handleSongClick = (index) => {
    if (index === correctSongIndex) {
      setWon(true);
    } else {
      setChances(chances - 1);
      if (chances === 1) {
        setTimeout(() => {
          setLost(true);
        }, 1000);
      }
    }
  };
  const updateLevel = async () => {
    const update = await axios.put(
      `http://localhost:3001/users/update/${user._id}`,
      {
        rating: 5,
      },
      {
        headers: {
          "x-api-key": localStorage.getItem("token"),
        },
      }
    );
    console.log("updated");
  };

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const lastGameDate = localStorage.getItem("lastGameDate");
    const currentDate = new Date();

    if (
      !lastGameDate ||
      (currentDate - new Date(lastGameDate)) / (1000 * 60 * 60) >= 24
    ) {
      songRender();
    } else {
      const nextGameDate = new Date(lastGameDate);
      nextGameDate.setDate(nextGameDate.getDate() + 1);
      nextGameDate.setHours(0, 0, 0, 0);
      const timeRemaining = nextGameDate - currentDate;
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeLeft(`${hours}h ${minutes}m`);
    }
  }, []);
  const handleAlbumTitleChange = (
    albumTitle,
    albumImg_url,
    album_artist,
    searchSongId,
    index
  ) => {
    if (chances === 0) {
      return;
    }

    if (searchSongId === songs[correctSongIndex]?.songId) {
      setWon(true);
      updateLevel();
      localStorage.setItem("lastGameDate", new Date().toISOString());
      if (audioRef.current) {
        audioRef.current.play();
      }
      setCorrectSong({
        title: songs[correctSongIndex]?.title,
        artist: songs[correctSongIndex]?.artist,
        img_url: songs[correctSongIndex]?.img_url,
      });
    } else {
      const updatedChances = chances - 1;
      setChances(updatedChances);

      if (updatedChances === 0) {
        setTimeout(() => {
          setCorrectSongVisible(true);
          setLost(true);
        }, 1000);
      }
    }
    setSelectedSongIndex(index);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {won ? (
            <div>
              <Col className="text-center">
                {won && <Alert variant="success">You won!</Alert>}
                {!won && chances === 0 && (
                  <Alert variant="danger">You ran out of chances!</Alert>
                )}
                {!won && timeLeft && (
                  <p>Come back in: {timeLeft} to play tomorrow's game</p>
                )}
              </Col>
              {/* Display the correct song information */}
              <div className="text-center">
                <div
                  className="instagram-post text-center rounded"
                  style={{
                    width: "50%",
                    marginBottom: "20px",
                    position: "relative",
                    borderRadius: "10px",
                    margin: "0 auto",
                  }}
                >
                  <img
                    className="rounded mt-3"
                    src={songs[correctSongIndex]?.img_url}
                    alt={`${songs.title} Album Cover`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px 10px 0 0",
                      border: "lightgray 1px solid",
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
                      {songs[correctSongIndex]?.album}
                    </p>
                    <p style={{ fontSize: "14px", margin: "0" }}>
                      {songs[correctSongIndex]?.artist}
                    </p>
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  controls
                  src={songs[correctSongIndex]?.preview}
                />
              </div>
            </div>
          ) : lost ? (
            <div>
              <div className="text-center">
                {" "}
                <div
                  className="instagram-post rounded"
                  style={{
                    width: "50%",
                    marginBottom: "20px",
                    position: "relative",
                    borderRadius: "10px",
                    margin: "0 auto",
                  }}
                >
                  <img
                    className="rounded mt-3"
                    src={songs[correctSongIndex]?.img_url}
                    alt={`${songs.title} Album Cover`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px 10px 0 0",
                      border: "lightgray 1px solid",
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
                      {songs[correctSongIndex]?.album}
                    </p>
                    <p style={{ fontSize: "14px", margin: "0" }}>
                      {songs[correctSongIndex]?.artist}
                    </p>
                  </div>
                </div>
                <Alert variant="danger">You ran out of chances!</Alert>
                <audio
                  ref={audioRef}
                  controls
                  src={songs[correctSongIndex]?.preview}
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <DeezerSearch
                onAlbumTitleChange={handleAlbumTitleChange}
                songs={songs}
                correctSongIndex={correctSongIndex}
              />
              {chances === 0 && <p>You ran out of chances!</p>}
              <div className="ms-3">
                <audio
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                  }}
                  ref={audioRef}
                  controls
                  src={songs[correctSongIndex]?.preview}
                />
                <p className="">{chances}&#9829;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongChallenge;
