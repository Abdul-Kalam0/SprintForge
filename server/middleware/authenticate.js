import jwt from "jsonwebtoken";

import ApiError from "../shared/ApiError.js";

export const authenticate = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(new ApiError(401, "Authentication required"));
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};
