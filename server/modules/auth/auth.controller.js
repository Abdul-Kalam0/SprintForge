import ApiResponse from "../../shared/ApiResponse.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from "./auth.service.js";

const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    return res
      .status(201)
      .json(new ApiResponse({ user }, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    // Access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(new ApiResponse({ user }, "Login successful"));
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await logoutUser(req.userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json(new ApiResponse(null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    return res
      .status(200)
      .json(new ApiResponse(null, "Access token refreshed successfully"));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.userId);

    return res
      .status(200)
      .json(new ApiResponse({ user }, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, refreshToken, getMe };
