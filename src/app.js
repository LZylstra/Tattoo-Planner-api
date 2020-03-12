const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./middleware/error-handler");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const clientsRouter = require("./clients/clients-router");
const eventsRouter = require("./events/events-router");
const tattoosRouter = require("./tattoos/tattoos-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.options("*", cors());
app.use(morgan(morganOption));
app.use(helmet());

app.use("/api/events", eventsRouter);
app.use("/api/tattoos", tattoosRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

module.exports = app;
