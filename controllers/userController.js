const User = require("../models/userModel");
const factory = require("./handlerFactory");

// Функция фильтрует req.body, когда пользователь хочет изменить свои данные. Необходимо, чтобы от не смог установить себе, например, поле role: admin
// В req.body останутся только те поля, которые переданы в аргументы в функции, начиная со второго (все они будут записаны в переменную allowedFileds внутри функции)

exports.getAllUsers = factory.getAll(User);
