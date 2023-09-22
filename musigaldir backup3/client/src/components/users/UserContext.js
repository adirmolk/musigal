import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  } else {
    axios
      .get("http://localhost:3001/users/profile", {
        headers: {
          "x-api-key": token,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
