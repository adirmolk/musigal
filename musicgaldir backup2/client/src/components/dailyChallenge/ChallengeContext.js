// ChallengeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChallengeContext = createContext();

export const useChallenge = () => {
  return useContext(ChallengeContext);
};

export const ChallengeProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [correctSongIndex, setCorrectSongIndex] = useState(null);
  const [albumId, setAlbumId] = useState(null);

  useEffect(() => {
    const songRender = async () => {
      try {
        const response = await axios.get("http://localhost:3001/songs");
        const data = response.data;

        if (!data || data.length === 0) {
          console.error("No songs data received.");
          return;
        }

        // Shuffle the songs
        const shuffledSongs = shuffleArray(data);
        // Select a random index as the correct song
        const randomNum = randomNumberInRange(0, 5); // Random index between 0 and 5 (6 songs)
        setCorrectSongIndex(randomNum);

        // Set the albumId for the correct song
        setAlbumId(shuffledSongs[randomNum].albumId);

        // Set the first 6 shuffled songs
        setSongs(shuffledSongs.slice(0, 6));
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    songRender();
  }, []);

  // Helper functions for shuffling and generating random numbers
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <ChallengeContext.Provider value={{ songs, correctSongIndex, albumId }}>
      {children}
    </ChallengeContext.Provider>
  );
};
