var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");

module.exports = router.delete("/delete", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var authorToDestroy = await AuthorModel.findOne({
      where: { id: idToDestroy },
    });
    if (!authorToDestroy) {
      res
        .status(404)
        .json({ message: "author to destroy not found", id: idToDestroy });
    } else {
      var destroyedAuthor = await authorToDestroy.destroy();
      res.status(200).json({ id: destroyedAuthor.id, destroyed: true });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
