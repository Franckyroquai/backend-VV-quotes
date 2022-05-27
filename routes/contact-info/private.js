const casual = require("casual");
var express = require("express");
const { getRandIdFromModel } = require("../../helpers/dev");
var router = express.Router();
var logger = require("../../helpers/logger");

var { ContactInfoModel } = require("../../models/contact-info");
var { UserModel } = require("../../models/user");

function sanitizeCreateContactInfoRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var userId = request.body.id; //undefined; // TODO : logique a implementer pepo
  //logique au cas ou c'est undefined;
  var error = { type: "bad request" };

  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } };
  }
  if (!requestBody.firstName || !(requestBody.firstName.length > 1)) {
    Object.assign({ entity: "firstName", details: "not present" });
  } else if (!(typeof requestBody.firstName === "string")) {
    Object.assign(error, { entity: "firstName", details: "not a string" });
  }
  if (!requestBody.lastName || !(requestBody.lastName.length > 1)) {
    Object.assign({ entity: "lastName", details: "not present" });
  } else if (!(typeof requestBody.lastName === "string")) {
    Object.assign(error, { entity: "lastName", details: "not a string" });
  }
  if (!requestBody.phoneNumber || !(requestBody.phoneNumber.length > 9)) {
    Object.assign({
      entity: "phoneNumber",
      details: "phoneNumber must have 10 characters",
    });
  } else if (!(typeof requestBody.phoneNumber === "string")) {
    Object.assign(error, { entity: "phoneNumber", details: "not a string" });
  }
  Object.assign(sanitizedObject, {
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    phoneNumber: requestBody.phoneNumber,
    userId,
  });
  return sanitizedObject;
}

function sanitizeUpdateContactInfoRequestObject(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var error = { type: "bad request" };

  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } };
  }
  if (!requestBody.id) {
    Object.assign(error, { entity: "id", details: "not present" });
  } else if (!(typeof requestBody.id === "number")) {
    Object.assign(error, { entity: "id", details: "not a number" });
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
  if (requestBody.firstName) {
    if (typeof requestBody.firstName != "string") {
      Object.assign(error, { entity: "content", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { firstName: requestBody.firstName });
    }
  }
  if (requestBody.lastName) {
    if (typeof requestBody.lastName != "string") {
      Object.assign(error, { entity: "content", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { lastName: requestBody.lastName });
    }
  }
  if (requestBody.phoneNumber) {
    //TODO: remplacer string par number quand le modèle contact info aura été changé
    if (typeof requestBody.phoneNumber != "string") {
      Object.assign(error, { entity: "content", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { phoneNumber: requestBody.phoneNumber });
    }
  }
  if (requestBody.userId) {
    if (typeof requestBody.userId != "number") {
      Object.assign(error, { entity: "userId", details: "not a number" });
    } else if (!(requestBody.userId > 0)) {
      Object.assign(error, {
        entity: "content",
        details: "not a positive value",
      });
    } else {
      Object.assign(sanitizedObject, { userId: requestBody.userId });
    }
  }
  if (Object.keys(sanitizedObject).length < 2) {
    Object.assign(error, { details: "not enough keys in" });
  }
  if (Object.keys(error).length > 1) {
    Object.assign(sanitizedObject, { error });
  }
  return sanitizedObject;
}

router.post("/create", async (req, res) => {
  try {
    var sanitizedContactInfoObject = sanitizeCreateContactInfoRequest(req);
    if (!sanitizedContactInfoObject.error) {
      var newContactInfo = await ContactInfoModel.create(
        sanitizedContactInfoObject
      );
      res.status(200).json(newContactInfo);
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.debug(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/update", async (req, res) => {
  try {
    var sanitized = sanitizeUpdateContactInfoRequestObject(req);
    if (!sanitized.error) {
      var contactInfoToUpdate = await ContactInfoModel.findOne({
        where: { id: req.body.id },
      });
      var updatedContactInfo = await contactInfoToUpdate.update(sanitized);
      res.status(200).json(updatedContactInfo);
    } else {
      var msg;
      if (sanitized.error.entity) {
        msg = `${sanitized.error.entity} is ${sanitized.error.details}`;
      } else {
        msg = `${sanitized.error.details} request body`;
      }
      res.status(400).json({ ...sanitized.error, msg });
    }
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      var message = `SQL Constraint Error parameter ${error.fields[0]} with value ${error.value} doesn't exists`;
      res.status(442).json({
        message,
        type: "Model Relation Constraint Error",
      });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
});

router.delete("/delete", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var contactInfoToDestroy = await ContactInfoModel.findOne({
      where: { id: idToDestroy },
    });
    if (!contactInfoToDestroy) {
      res.status(404).json({
        message: "contact-info to destroy not found",
        id: idToDestroy,
      });
    } else {
      var destroyedContactInfo = await contactInfoToDestroy.destroy();
      res.status(200).json({ id: destroyedContactInfo.id, destroyed: true });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/generate", async (req, res) => {
  var generationQty = req.body.number || 5;
  var contactInfoArray = [];
  try {
    for (var idx = 0; idx < generationQty; idx++) {
      var userId = await getRandIdFromModel(UserModel);
      contactInfoArray.push({
        firstName: casual.first_name,
        lastName: casual.last_name,
        phoneNumber: casual.phone,
        userId,
      });
    }
    var contactInfos = await ContactInfoModel.bulkCreate(contactInfoArray);
    res
      .status(200)
      .json({ ok: true, numberOfContactInfos: contactInfos.length });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/validate", async (req, res) => {
  res.send("todo"); //TODO: to implement for pepo
});

module.exports = router;
