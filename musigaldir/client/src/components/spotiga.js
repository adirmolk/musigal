const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3003; // Choose a port for your server

const clientId = "009b5153b0124b80a2a7e730c72c3341";
const clientSecret = "5589f9a8092e49f9a96fae1f43a22385";
const redirectUri = "http://localhost:3001/home"; // Match your client's redirect URI

app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to exchange code for access token
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const authString = `${clientId}:${clientSecret}`;
  const encodedAuth = Buffer.from(authString).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    // Store tokens in a database or session for the user

    res.redirect("http://localhost:3001/home"); // Redirect to your app's frontend
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});