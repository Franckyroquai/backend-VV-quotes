var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");
var { randomIntFromInterval } = require("../../../helpers/math");
const { getRandIdFromModel } = require("../../../helpers/dev");

var { UserModel } = require("../../../models/user");
var { CategoryModel } = require("../../../models/category");
var casual = require("casual");

module.exports = router.verb("/URL", async (req, res) => {
  try {
    var generationQty = req.body.number || 5;
    var postsArray = [];
    for (var idx = 0; idx < generationQty; idx++) {
      var userId = await getRandIdFromModel(UserModel);
      var categoryId = await getRandIdFromModel(CategoryModel);
      postsArray.push({
        content: casual.sentence,
        title: casual.title,
        subtitle: casual.title,
        link: casual.url,
        numberOfViews: casual.building_number,
        numberOfLikes: casual.building_number,
        categoryId,
        userId,
      });
    }
    var posts = await PostModel.bulkCreate(postsArray);
    logger.info("posts >>", posts.length, "<<");
    res.status(200).json({ ok: true, number: posts.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
