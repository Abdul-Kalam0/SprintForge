import bcrypt from "bcrypt";

import UserModel from "./models/User.js";
import ApiError from "../../shared/ApiError.js";
import jwt from "jsonwebtoken";

import { generateAccessToken, generateRefreshToken } from "./auth.token.js";

const registerUser = async ({ fullName, email, password }) => {
  // 1. Check if user already exists
  const existingUser = await UserModel.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // 3. Create user
  const user = await UserModel.create({
    fullName,
    email,
    passwordHash,
  });

  // 4. Return safe user data
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
  };
};

const loginUser = async ({ email, password }) => {
  // 1. Find user
  const existingUser = await UserModel.findOne({ email }).select(
    "+passwordHash",
  );

  if (!existingUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser.passwordHash,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 3. Generate access token
  const accessToken = generateAccessToken(existingUser._id);

  // 4. Generate refresh token
  const refreshToken = generateRefreshToken(existingUser._id);

  // 5. Hash refresh token
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  // 6. Store refresh token hash
  existingUser.refreshTokenHash = refreshTokenHash;

  await existingUser.save();

  // 7. Return safe user data + tokens
  return {
    user: {
      id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profileImage: existingUser.profileImage,
    },
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (userId) => {
  await UserModel.findByIdAndUpdate(userId, {
    refreshTokenHash: null,
  });
};

const refreshAccessToken = async (refreshToken) => {
  // 1. Check if refresh token exists
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  // 2. Verify refresh token
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // 3. Find user
  const user = await UserModel.findById(decoded.id).select("+refreshTokenHash");

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // 4. Check stored refresh token hash
  if (!user.refreshTokenHash) {
    throw new ApiError(401, "Session expired or logged out");
  }

  // 5. Compare refresh token with stored hash
  const isValidRefreshToken = await bcrypt.compare(
    refreshToken,
    user.refreshTokenHash,
  );

  if (!isValidRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // 6. Generate new access token
  const accessToken = generateAccessToken(user._id);

  return accessToken;
};

const getCurrentUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,
  };
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
