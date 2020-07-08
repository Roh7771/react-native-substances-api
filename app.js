const express = require("express");
const cors = require("cors");
const substanceRouter = require("./routes/substanceRoutes");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const mongoSanitize = require("express-mongo-sanitize");

// const corsOptions = {
//   origin: ["https://roh7771.github.io", "http://localhost:9000"],
//   credentials: true,
// };

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const app = express();

app.use(mongoSanitize());
app.use(express.json())

app.use(cors());

// 3) ROUTES
app.use("/api/v1/substances", substanceRouter);
app.use("/api/v1/users", userRoutes);

// Для неправильного URL
app.all("*", (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );

  next(error);
});

// Глобальный Middleware для обработки ошибок
app.use(globalErrorHandler);

module.exports = app;
