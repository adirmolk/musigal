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
    "AQBNgCkFHMpfidTuxAPkKsn1T4XfO-EMTTQ7snK6hxB9GmeULmnF6RA6pXl1E6A7AHOd8LUVL7Eu6sV12bBMWlWcNikpqu-1OJu92WExf4a_G4-PKAMPBIEjzlw5a4tGNB1av_2HIzpOpajb6Qki7aKbdxJ2Ahvx";

  const accessToken = await buddyList.getWebAccessToken(spDcCookie);
  console.log(accessToken);

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
