import crypto from "crypto";

export const generateApplicationId = () => {
  const random = crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `SCH-${Date.now()}-${random}`;
};

export const generateConversationId = () => {
  return crypto.randomBytes(12).toString("hex");
};