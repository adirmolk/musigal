import axios from "axios";
import { useEffect, useState } from "react";

const useFriendsList = () => {
  const [friendsList, setFfiendsList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:3001/api/friendList").then((res) => {
      setIsLoading(false);
      setFfiendsList(res.data);
    });
  }, []);

  return { friendsList, isLoading };
};

export default useFriendsList;
