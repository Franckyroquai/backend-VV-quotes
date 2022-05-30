var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { ContactInfoModel } = require("../../../models/contact-info");

module.exports = router.delete("/delete", async (req, res) => {
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
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
