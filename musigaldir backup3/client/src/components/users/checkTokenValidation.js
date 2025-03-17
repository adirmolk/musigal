import axios from "axios";

const checkTokenValidation = async () => {
  const token = localStorage.getItem("token");

  try {
    const isValidToken = await axios.get(
      "http://localhost:3001/api/users/profile",
      {
        headers: {
          "x-api-key": token,
        },
      }
    );
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "/login";
    } else {
      console.error("Error checking token validity:", error);
    }
  }
};

export default checkTokenValidation;
