const { UserModel } = require("../models/user");
const { ContactInfoModel } = require("../models/contact-infos");
const { QuoteModel } = require("../models/quote");
const { AuthorModel } = require("../models/author");
const { PostModel } = require("../models/post");
const { CategoryModel } = require("../models/category");
const { CommentModel } = require("../models/comments");
const { syncronize } = require("../helpers/sql");
const logger = require("../helpers/logger");

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
