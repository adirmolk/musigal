import axios from "axios";

const checkTokenValidation = async () => {
  // You can remove the useNavigate and nav lines from here
  const token = localStorage.getItem("token");

  try {
    const isValidToken = await axios.get(
      "http://localhost:3001/users/profile",
      {
        headers: {
          "x-api-key": token,
        },
      }
    );
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Instead of using nav here, return a value to indicate a redirect is needed
      return "/login";
    } else {
      console.error("Error checking token validity:", error);
    }
  }
};

export default checkTokenValidation;
