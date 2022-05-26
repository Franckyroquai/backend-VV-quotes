var { UserModel } = require("../models/user");
var { ContactInfoModel } = require("../models/contact-info");
var { QuoteModel } = require("../models/quote");
var { AuthorModel } = require("../models/author");
var { PostModel } = require("../models/post");
var { CategoryModel } = require("../models/category");
var { CommentModel } = require("../models/comment");
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

async function groupSync() {
  try {
    await syncronize(UserModel, "user");
    await syncronize(ContactInfoModel, "contact-info");
    await syncronize(AuthorModel, "author");
    await syncronize(QuoteModel, "quote");
    await syncronize(CategoryModel, "category");
    await syncronize(PostModel, "post");
    await syncronize(CommentModel, "comment");
  } catch (err) {
    logger.error(err);
  }
}

groupSync();
