module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://lzylstra@localhost/tattoo-app",
  CLIENT_ID: process.env.CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET || "purplecow",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "15m",
  API_BASE_URL:
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
  CLIENT_ORIGIN: "https://tattoo-planner-app.now.sh/"
};
