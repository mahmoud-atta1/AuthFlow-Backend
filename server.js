const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

const dbConnection = require("./src/config/db");
const globalError = require("./src/middlewares/errorMiddleware");
const ApiError = require("./src/utils/apiError");

const AuthRouter = require("./src/routes/Auth.routes");
const UserRouter = require("./src/routes/User.routes");

dotenv.config({ path: ".env" });

const app = express();

dbConnection();

app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again in 15 minutes!",
});
app.use("/api", limiter);
app.use(express.json({ limit: "20kb" }));
app.use(express.static("uploads"));
app.use(hpp());
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);

app.all("", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
