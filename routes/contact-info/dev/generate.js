var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { ContactInfoModel } = require("../../../models/contact-info");
var { UserModel } = require("../../../models/user");
const casual = require("casual");
const { getRandIdFromModel } = require("../../../helpers/dev");

module.exports = router.post("/generate", async (req, res) => {
  try {
    var generationQty = req.body.number || 5;
    var contactInfoArray = [];
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
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});