import jwt from "jsonwebtoken";

/**
 * Generate a JWT for a user
 * @param {string} userId - The user ID to include in the payload
 * @returns {string} - The signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Changed default to 7d to match typical cookie duration
  });
};

export default generateToken;

