const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//refreshToken array

const refreshTokens = [];

//2) create post(login) route
app.post("/login", (req, res) => {
  console.log("Login route is working");
  const { username, password } = req.body;
  console.log(`username is ${username} and password is ${password}`);

  //3) create jwt accessToken and refreshToken
  //jwt.sing(object value,secret,expire time)
  const accessToken = jwt.sign({ username: username }, "Access Secret", {
    expiresIn: "10s",
  });
  const refreshToken = jwt.sign({ username: username }, "Refresh Secret", {
    expiresIn: "24h",
  });
  //push refresh token to the refreshTokens array
  refreshTokens.push(refreshToken);
  //send response
  res.status(200).json({ accessToken, refreshToken });
});

//give new accesToken if expire issued accessToken when logging
app.post("/token", (req, res) => {
  const { username, refreshToken } = req.body;
  console.log(refreshToken);
  console.log(refreshTokens);
  if (refreshToken == null) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken))
    res.json({
      message: "Not include refresh token in the refreshTokens Array",
    });
  jwt.verify(refreshToken, "Refresh Secret", (err, user) => {
    console.log(user);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign({ username: user.username }, "Access Secret", {
      expiresIn: "10s",
    });
    res.json({ newAccessToken: accessToken });
  });
});

//1) create server
app.listen(8080, () => {
  console.log("Server running on 8080");
});
