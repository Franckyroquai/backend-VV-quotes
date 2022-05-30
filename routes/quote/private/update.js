var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { QuoteModel } = require("../../../models/quote");

function sanitizeQuoteUpdateRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  if (!requestBody) {
    return false;
  }
  if (!requestBody.id || typeof requestBody.id != "number") {
    return false;
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
  if (requestBody.text) {
    if (typeof requestBody.text != "string") {
      return false;
    } else {
      Object.assign(sanitizedObject, { text: requestBody.text });
    }
  }
  if (requestBody.authorId) {
    if (typeof requestBody.authorId != "number") {
      return false;
    } else {
      Object.assign(sanitizedObject, { authorId: requestBody.authorId });
    }
  }
  if (requestBody.userId) {
    if (typeof requestBody.userId != "number") {
      return false;
    } else {
      Object.assign(sanitizedObject, { userId: requestBody.userId });
    }
  }
  return sanitizedObject;
}

module.exports = router.post("/update", async (req, res) => {
  try {
    var sanitizedObject = sanitizeQuoteUpdateRequest(req);
    logger.debug("try to debug: ", sanitizedObject);
    if (sanitizedObject) {
      var quoteToUpdate = await QuoteModel.findOne({
        where: { id: req.body.id },
      });
      var updatedQuote = await quoteToUpdate.update(sanitizedObject);
      res.status(200).json({
        id: updatedQuote.id,
        text: updatedQuote.text,
        authorId: updatedQuote.authorId,
        userId: updatedQuote.userId,
      });
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
