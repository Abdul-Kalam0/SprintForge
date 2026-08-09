import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      id: userId.toString(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};

export { generateAccessToken, generateRefreshToken };
