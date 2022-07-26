const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidName = function (name) {
  return /^[a-zA-Z ]*$/.test(name);
};

const isValidPhone = function (phone) {
  return /^[6-9]\d{9}$/.test(phone);
};

const isValidPassword = function (password) {
  return password.length >= 1 && password.length <= 15;
};

const isValidStreet = function (street) {
  return /^[a-zA-Z0-9\/\-\,\.\(\) ]*$/.test(street);    //Change message in controller.!!!!
};

const isValidCity = function (city) {
  return /^[a-zA-Z\- ]*$/.test(city);
};

const isValidPincode = function (pincode) {
  return /^[1-9]\d{5}$/.test(pincode);
};

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidName,
  isValidPhone,
  isValidPassword,
  isValidStreet,
  isValidPincode,
  isValidCity,
};
