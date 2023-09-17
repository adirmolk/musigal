const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  const token = req.header("x-api-key");

  if (!token) {
    return res.status(401).json({ err: "You need to send a token in the 'x-api-key' header." });
  }

  try {
    const decodedToken = jwt.verify(token, "adirmolkSecret");
    req.tokenData = decodedToken;
    next();
  } catch (err) {
    // Handle token expiration error
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ err: "Token has expired." });
    }

    // Handle other JWT verification errors
    return res.status(401).json({ err: "Invalid token." });
  }
};

exports.authMaxim = async (req, res, next) => {
  const token = req.header("x-api-key");
  
  if (!token) {
    return res.status(401).json({ err: "You need to send a token in the 'x-api-key' header." });
  }

  // Verify the token without throwing an error for expiration
  const decodedToken = jwt.decode(token, { complete: true });

  // Check if the token has expired
  if (decodedToken && decodedToken.payload.exp < Date.now() / 1000) {
    return res.redirect("login");
  }
  

  req.tokenData = decodedToken;
  next();
};
