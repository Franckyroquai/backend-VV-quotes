var { UserModel } = require("../models/user");
var { ContactInfoModel } = require("../models/contact-info");
var { QuoteModel } = require("../models/quote");
var { AuthorModel } = require("../models/author");
var { PostModel } = require("../models/post");
var { CategoryModel } = require("../models/category");
var { CommentModel } = require("../models/comment");
var { ImageModel } = require("../models/image");
var { TagModel } = require("../models/tag");
var { syncronize } = require("../helpers/sql");
var { getSequelizeInstance } = require("./db-connection");
var logger = require("../helpers/logger");

UserModel.hasOne(ContactInfoModel);
ContactInfoModel.belongsTo(UserModel);

UserModel.hasMany(QuoteModel);
QuoteModel.belongsTo(UserModel);

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

AuthorModel.hasMany(QuoteModel);
QuoteModel.belongsTo(AuthorModel);

CategoryModel.hasMany(PostModel);
PostModel.belongsTo(CategoryModel);

PostModel.hasMany(CommentModel);
CommentModel.belongsTo(PostModel);

UserModel.hasMany(CommentModel);
CommentModel.belongsTo(UserModel);

// UserModel.hasMany(ImageModel);
// ImageModel.belongsTo(UserModel);

PostModel.belongsToMany(TagModel, {
  through: "post_tag",
  as: "tags",
  foreignKey: "post_id",
});
TagModel.belongsToMany(PostModel, {
  through: "post_tag",
  as: "posts",
  foreignKey: "tag_id",
});

async function groupSync() {
  try {
    syncronize(getSequelizeInstance());
  } catch (err) {
    logger.error(err);
  }
}

groupSync();
