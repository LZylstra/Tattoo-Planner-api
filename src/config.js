module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "postgresql://lzylstra@localhost/tattoo-app",
  JWT_SECRET: process.env.JWT_SECRET || "purplecow",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "15m",
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api"
};
