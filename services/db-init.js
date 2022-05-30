var { UserModel } = require("../models/user");
var { ContactInfoModel } = require("../models/contact-info");
var { QuoteModel } = require("../models/quote");
var { AuthorModel } = require("../models/author");
var { PostModel } = require("../models/post");
var { CategoryModel } = require("../models/category");
var { CommentModel } = require("../models/comment");
var { ImageModel } = require("../models/image");
var { syncronize } = require("../helpers/sql");
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

async function groupSync() {
  try {
    await syncronize(UserModel);
    await syncronize(ContactInfoModel);
    await syncronize(AuthorModel);
    await syncronize(QuoteModel);
    await syncronize(CategoryModel);
    await syncronize(PostModel);
    await syncronize(CommentModel);
    await syncronize(ImageModel);
  } catch (err) {
    logger.error(err);
  }
}

groupSync();
