const Substance = require("./../models/substanceModel");
const factory = require("./handlerFactory");

exports.getAllSubstances = factory.getAll(Substance);
