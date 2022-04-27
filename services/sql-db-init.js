const { AuthorModel } = require("../models/sql-authors");
const { QuoteModel } = require("../models/sql-quote");
const { UserModel } = require("../models/sql-user");
const { ContactInfoModel } = require("../models/sql-contact-infos");

const { syncronize } = require("../helpers/sql");

syncronize(UserModel, "user");
syncronize(ContactInfoModel, "contact infos");
syncronize(QuoteModel, "quote");
syncronize(AuthorModel, "author");
