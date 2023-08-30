const express = require("express");
const buddyList = require(".");
const app = express();

app.use(express.json());
const port = 3000;

const cors = require("cors");

// Allow requests from your frontend's localhost
const corsOptions = {
  origin: "http://localhost:3001", // Change this to your frontend's URL and port
  methods: "GET,POST,PUT,DELETE",
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Define a simple GET route
app.get("/api/friendList", async (req, res) => {
  const friendActivity = await getFriendsActicityList();
  res.json(friendActivity); // Sending the friendActivity object as JSON
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const getFriendsActicityList = async () => {
  const spDcCookie =
    "AQCCDpOB1D1ttS8vW-4MSoJgLm2cTxQ-Sgr3kQSR015r0oX-o-xFEcnofDSu394ddzo25L_ZsqzT_LcFpuT8Vh2oClTrAKt9fbN9gUidaW8SeCTJ9erAmAaP0yYopVVOCbne4VpMmGEQ6rF07QuADWq06shk6DYs";

  const { accessToken } = await buddyList.getWebAccessToken(spDcCookie);
  const friendActivity = await buddyList.getFriendActivity(accessToken);

  return friendActivity; // Returning the object directly
};
