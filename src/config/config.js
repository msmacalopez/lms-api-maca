import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongo: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017/lms-db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expires: process.env.JWT_EXPIRES || "1d",
  },
  renewJwt: {
    secret: process.env.JWT_RENEW_SECRET || "renew-secret",
    expires: process.env.JWT_RENEW_EXPIRES || "1d",
  },
};

export default config;
