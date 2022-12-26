const jwt = require("jsonwebtoken");

exports.createToken = async (user, expiresIn = "1y") => {
  const payload = {
    id: user.id,
    firstname: user.firstname,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, 'MY_JWT_SECRET', {
  // TODO: use env variable
  // return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

exports.checkToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, 'MY_JWT_SECRET');
    // TODO: use env variable
    // const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.id,
      firstname: decoded.firstname,
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    return false;
  }
};

exports.extractUserFromToken = async (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.sendStatus(401);
  }
  const [type, token] = header.split(/\s+/);
  if (type !== "Bearer") {
    return res.sendStatus(401);
  }
  const user = await exports.checkToken(token);
  return user;
}