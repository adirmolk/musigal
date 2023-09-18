// ספריית אקספרס עם כל היכולות
const express = require("express");
// מבצע מינפולציות על כתובות אינטרנט
const path = require("path");
const cors = require("cors");
// ספרייה שיודעת להפעיל שרת
const http = require("http");
const buddyList = require("./index");

const { routesInit } = require("./routes/configRoutes");
// התחברות למונגו
require("./db/mongoConnect");

const app = express();

// כדי שנוכל לקבל באדי עם ג'ייסון בבקשות פוסט , עריכה ומחיקה
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000", // Change this to your frontend's URL and port
  methods: "GET,POST,PUT,DELETE,PATCH",
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Define a simple GET route
app.get("/api/friendList", async (req, res) => {
  const friendActivity = await getFriendsActicityList();
  res.json(friendActivity); // Sending the friendActivity object as JSON
});

const getFriendsActicityList = async () => {
  const spDcCookie =
    "AQCCDpOB1D1ttS8vW-4MSoJgLm2cTxQ-Sgr3kQSR015r0oX-o-xFEcnofDSu394ddzo25L_ZsqzT_LcFpuT8Vh2oClTrAKt9fbN9gUidaW8SeCTJ9erAmAaP0yYopVVOCbne4VpMmGEQ6rF07QuADWq06shk6DYs";

  const { accessToken } = await buddyList.getWebAccessToken(spDcCookie);
  const friendActivity = await buddyList.getFriendActivity(accessToken);

  return friendActivity; // Returning the object directly
};

// מגדיר שתקיית פאבליק וכל הקבצים בה יהיו ציבוריים
app.use(express.static(path.join(__dirname, "public")));
// פונקציה שאחראית להגדיר את כל הרואטים שנייצר באפלקציית שרת
routesInit(app);

const server = http.createServer(app);
// בודק באיזה פורט להריץ את השרת  , אם בשרת אמיתי אוסף
// את המשתנה פורט מהסביבת עבודה שלו ואם לא 3001
const port = 3001;
server.listen(port);
