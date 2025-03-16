import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Handle async loading

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log(token + " this is the token ");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3001/api/users/profile",
          {
            headers: { "x-api-key": token },
          }
        );
        console.log(response.data + "this is the user ");

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setLoading(false); // ✅ Ensure state updates
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>; // ✅ Prevent rendering before data loads

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
