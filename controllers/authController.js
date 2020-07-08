const User = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Создает JWT-токен, записывая id-пользователя в payload
// После декодирования можно найти юзера по id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Создает и отправляет токен каждый раз, когда пользователь логинится, регистрируется, меняет или восстанавливает пароль и т.д.
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined; // На всякий случай убираем поле password

  res.status(statusCode).json({
    status: "success",
    token, // Так лучше не передавать токен
    data: {
      user,
    },
  });
};

// Функция для логина юзера
exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({ name: req.body.name }).select("+password"); // добавляем поле password, которое не возвращается по умолчанию

  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user no longer exist", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again"),
      401
    );
  }

  req.user = currentUser;
  next();
});
