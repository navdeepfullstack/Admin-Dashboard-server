const path = require("path");
const util = require("util");
const fs = require("fs");

const { Validator } = require("node-input-validator");

module.exports = {
  getDatesInRange: async (startDate, endDate) => {
    let todayDate = new Date(new Date().toString().split("GMT")[0] + " UTC")
      .toISOString()
      .replace(/\..+/, "");
    let todayZone = new Date(todayDate.split("T")[0]);

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      if (date.getTime() >= todayZone.getTime()) dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  },

  makeid: async (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  makeslug: async (length) => {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  validateInput: async (body, fields) => {
    let v = new Validator(body, fields);
    var errorsResponse;

    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.join(", ");
        console.log(errorsResponse);
      }
    });
    if (errorsResponse) {
      throw errorsResponse;
    }
  },

  error: async function (res, err, req) {
    console.log("----------", err, "===========================>error");

    let code = typeof err === "object" ? (err.code ? err.code : 400) : 400;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;

    if (req) {
      req.flash("flashMessage", {
        color: "error",
        message,
      });

      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: null,
    });
  },
  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },

  bcryptHash: (myPlaintextPassword, saltRounds = 10) => {
    const bcrypt = require("bcrypt");
    const salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(myPlaintextPassword, salt);
    hash = hash.replace("$2b$", "$2y$");
    return hash;
  },

  failed: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: {},
    });
  },
  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },
};
