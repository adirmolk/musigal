import React, { useEffect, useState } from "react";
import buddyList from "../SpotifyBuddy/index"; // Replace with the actual relative path

function Buddy() {
  const [friendActivity, setFriendActivity] = useState([]);

  useEffect(() => {
    let isMounted = true; // Flag to track component's mount status

    const spDcCookie = "AQCCDpOB1D1ttS8vW-4MSoJgLm2cTxQ-Sgr3kQSR015r0oX-o-xFEcnofDSu394ddzo25L_ZsqzT_LcFpuT8Vh2oClTrAKt9fbN9gUidaW8SeCTJ9erAmAaP0yYopVVOCbne4VpMmGEQ6rF07QuADWq06shk6DYs"; // Replace with your spDcCookie

    async function fetchFriendActivity() {
      try {
        const { accessToken } = await buddyList.getWebAccessToken(spDcCookie);
        const activity = await buddyList.getFriendActivity(accessToken);

        if (isMounted) {
          setFriendActivity(activity.buddies);
        }
      } catch (error) {
        console.error("Error fetching friend activity:", error);
      }
    }

    fetchFriendActivity();
    const fetchInterval = setInterval(fetchFriendActivity, 1000 * 60); // Fetch every minute

    return () => {
      isMounted = false; // Component is unmounting, so set the flag to false
      clearInterval(fetchInterval); // Clear the interval when component is unmounted
    };
  }, []);

  return (
    <div>
      <h1>Friends' Current Playing Songs</h1>
      <ul>
        {friendActivity.map((friend) => (
          <li key={friend.username}>
            <strong>{friend.username}</strong> is listening to{" "}
            <strong>{friend.songName}</strong> from the album{" "}
            <strong>{friend.albumName}</strong>
            <img
              src={friend.albumImageUrl}
              alt={`${friend.songName} Album Cover`}
              style={{ width: "50px", height: "50px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Buddy;
