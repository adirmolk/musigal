import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../users/UserContext";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Alert, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeezerSearch from "./DeezerSearch";
import AlbumChallenge from "./AlbumChallenge";
import SongChallenge from "./SongChallenge";

const DailyChallenge = () => {
  const user = useUser();
  const [songs, setSongs] = useState([]);
  const [correctSongIndex, setCorrectSongIndex] = useState(null);
  const [chances, setChances] = useState(3);
  const [won, setWon] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [blurCorrectImage, setBlurCorrectImage] = useState(true);
  const [correctSongVisible, setCorrectSongVisible] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);
  const audioRef = useRef(null);
  const [albumId, setAlbumId] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [details, setDetails] = useState({});
  const [lost, setLost] = useState(false);
  const [showAlbumComponent, setShowAlbumComponent] = useState(false);
  const [showSongComponent, setShowSongComponent] = useState(false);
  const navigate = useNavigate();

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
  const randomAlbum = randomNumberInRange(1, 100);
  const fetchDeezerData = async () => {
    if (!albumId) {
      console.error("Album ID is not available.");
      return;
    }

    const options = {
      method: "GET",
      url: `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`,
      headers: {
        "X-RapidAPI-Key": "f2954e8161mshe367dd9c79a3865p17b030jsnd10838d0ffa3",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log("Fetched Tracks Data:", data.tracks.data);
      setTracks(data.tracks.data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchDeezerData();
      console.log(songs);
    }
  }, [albumId]);

  const songRender = async () => {
    try {
      const response = await axios.get("http://localhost:3001/songs");
      const data = response.data;
      if (!data || data.length === 0) {
        console.error("No songs data received.");
        return;
      }

      const shuffledSongs = shuffleArray(data);
      const randomNum = randomNumberInRange(0, 5);
      setCorrectSongIndex(randomNum);

      setAlbumId(shuffledSongs[randomNum].albumId);

      setSongs(shuffledSongs.slice(0, 6));
    } catch (error) {
      console.error("Error fetching songs:", error);
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
  };

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const lastGameDate = localStorage.getItem("lastGameDate");
    const currentDate = new Date();

    if (
      !lastGameDate ||
      (currentDate - new Date(lastGameDate)) / (1000 * 60 * 60) >= 0
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

  useEffect(() => {
    if (won || chances === 0) {
      setTimeout(() => {
        setCorrectSongVisible(true);
      }, 1000);
    }
  }, [won, chances]);

  const handleAlbumTitleChange = (
    albumTitle,
    albumImg_url,
    album_artist,
    searchSongId,
    index
  ) => {
    setDetails({
      title: albumTitle,
      artist: album_artist,
      img_url: albumImg_url,
      songId: searchSongId,
    });

    if (searchSongId === songs[correctSongIndex]?.songId) {
      setWon(true);
      updateLevel();
      localStorage.setItem("lastGameDate", new Date().toISOString());
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      setChances(chances - 1);

      if (chances === 1) {
        setTimeout(() => {
          setCorrectSongVisible(true);
          setLost(true);
        }, 1000);
      }
    }
    setSelectedSongIndex(index);
  };
  const toggleAlbumComponent = () => {
    setShowAlbumComponent(!showAlbumComponent);
    setShowSongComponent(false);
  };
  const toggleSongComponent = () => {
    setShowSongComponent(!showSongComponent);
    setShowAlbumComponent(false);
  };

  return (
    <Container className="mt-5">
      <Row className="text-center">
        <h2 className="mt-3">Daily Challenge</h2>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={12}>
          {showAlbumComponent ? (
            <AlbumChallenge
              tracks={tracks}
              songs={songs}
              correctSongIndex={correctSongIndex}
            />
          ) : (
            <div>
              {showSongComponent && (
                <div className="mt-3 d-flex flex-column align-items-center">
                  <h4 className="text-primary">Song Challenge</h4>
                  <SongChallenge />
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          {!showAlbumComponent && !timeLeft && <p className="mt-4"></p>}
          {won && <Alert variant="success">You won!</Alert>}
          {!won && chances === 0 && (
            <Alert variant="danger">You ran out of chances!</Alert>
          )}
          {!won && timeLeft && (
            <p className="mt-4">
              Come back in: {timeLeft} to play tomorrow's game
            </p>
          )}
        </Col>
      </Row>
      {correctSongVisible && (
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={12}>
            <div className="instagram-post rounded mt-4">
              <img
                className="rounded-top"
                src={songs[correctSongIndex]?.img_url}
                alt={`${songs.title} Album Cover`}
              />
              <div className="text-center rounded-bottom">
                <p className="font-weight-bold mt-2">
                  {songs[correctSongIndex]?.title}
                </p>
                <p className="mb-3">{songs[correctSongIndex]?.artist}</p>
              </div>
            </div>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={12}>
          <div className="d-flex justify-content-between mt-4">
            {/* Show buttons to switch between components */}
            {!showAlbumComponent && !won && !timeLeft && (
              <Button
                variant="primary"
                onClick={toggleAlbumComponent}
                className="flex-grow-1 mr-2"
              >
                Album Challenge
              </Button>
            )}
            {!showSongComponent && !won && !timeLeft && (
              <Button
                variant="primary"
                onClick={toggleSongComponent}
                className="flex-grow-1 ml-2"
              >
                Song Challenge
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyChallenge;
