var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { ContactInfoModel } = require("../../../models/contact-info");

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

module.exports = router.post("/", async (req, res) => {
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
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
