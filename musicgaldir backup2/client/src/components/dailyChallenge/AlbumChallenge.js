import React, { useEffect, useRef, useState } from "react";
import DeezerSearch from "./DeezerSearch";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../users/UserContext";

const styles = {
  container: {
    background: "#f7f7f7",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  track: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "10px",
    background: "#fff",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  trackTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
};

const AlbumChallenge = ({ tracks, songs, correctSongIndex }) => {
  const [details, setDetails] = useState({});
  const [won, setWon] = useState(false);
  const [chances, setChances] = useState(4);
  const [lost, setLost] = useState(false);
  const audioRef = useRef(null);
  const user = useUser();

  const [unlockedTracks, setUnlockedTracks] = useState([
    Math.floor(Math.random() * tracks.length),
  ]);
  const [counter, setCounter] = useState(tracks.length);

  const onWin = () => {
    setWon(true);
  };
  useEffect(() => {
    if (won || lost) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [won, lost]);

  const unlockRandomTrack = () => {
    const lockedTracks = tracks.filter(
      (_, index) => !unlockedTracks.includes(index)
    );
    if (lockedTracks.length > 0) {
      const randomLockedTrackIndex = Math.floor(
        Math.random() * lockedTracks.length
      );
      const unlockedTrackIndex = tracks.indexOf(
        lockedTracks[randomLockedTrackIndex]
      );
      setUnlockedTracks((prevUnlockedTracks) => [
        ...prevUnlockedTracks,
        unlockedTrackIndex,
      ]);
    }
  };
  const updateLevel = async () => {
    const update = await axios.put(
      `http://localhost:3001/users/update/${user._id}`,
      {
        rating: counter,
      },
      {
        headers: {
          "x-api-key": localStorage.getItem("token"),
        },
      }
    );
    console.log("updated");
  };

  const handleShowMoreClick = () => {
    if (counter > 0) {
      unlockRandomTrack();
      setCounter(counter - 1);
    }
  };

  const isTrackUnlocked = (index) => {
    return unlockedTracks.includes(index);
  };

  const getTrackDisplayText = (index) => {
    return isTrackUnlocked(index)
      ? `) ${tracks[index]?.title}`
      : `${index + 1}) locked`;
  };

  const handleAlbumTitleChange = (
    albumTitle,
    albumImg_url,
    album_artist,
    searchSongId,
    searchAlbumId
  ) => {
    setDetails({
      title: albumTitle,
      artist: album_artist,
      img_url: albumImg_url,
      songId: searchSongId,
      albumId: searchAlbumId,
    });

    if (searchAlbumId === songs[correctSongIndex]?.albumId) {
      onWin();
      updateLevel();
    } else {
      const updatedChances = chances - 1;
      setChances(updatedChances);

      if (updatedChances === 0) {
        setTimeout(() => {
          setLost(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    console.log(songs);
    console.log(details);
  }, [details]);

  return (
    <div>
      {tracks && tracks.length > 0 && !won && !lost && (
        <div className="text-center" style={styles.container}>
          <DeezerSearch
            onAlbumTitleChange={handleAlbumTitleChange}
            songs={songs}
            correctSongIndex={correctSongIndex}
            onWin={onWin}
          />
          {tracks && tracks.length > 0 && !won && !lost ? (
            tracks.map((track, index) => (
              <div className="" key={index} style={styles.track}>
                <h1 style={styles.trackTitle}>
                  <span style={{ fontSize: "14px" }}>
                    {index + 1}
                    {isTrackUnlocked(index)
                      ? getTrackDisplayText(index)
                      : ")🔒"}
                  </span>
                </h1>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      )}
      {!won && chances > 0 && unlockedTracks.length < tracks.length && (
        <div className="">
          <p>{chances}&#9829;</p>
          <p>{counter} Points</p>
          <button onClick={handleShowMoreClick} className="btn btn-primary">
            Show More
          </button>
        </div>
      )}

      {won && (
        <div>
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
              <p style={{ fontWeight: "bold", fontSize: "16px", margin: "0" }}>
                {songs[correctSongIndex]?.album}
              </p>
              <p style={{ fontSize: "14px", margin: "0" }}>
                {songs[correctSongIndex]?.artist}
              </p>
            </div>
          </div>
          <div className="text-center">
            <Alert variant="success">You won!</Alert>
            <audio
              ref={audioRef}
              controls
              src={songs[correctSongIndex]?.preview}
            />
          </div>
        </div>
      )}

      {!won && chances === 0 && (
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
              <p style={{ fontWeight: "bold", fontSize: "16px", margin: "0" }}>
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
      )}
    </div>
  );
};

export default AlbumChallenge;
