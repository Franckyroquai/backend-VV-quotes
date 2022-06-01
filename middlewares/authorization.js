var logger = require("../helpers/logger");
const routeConfigs = require("../config/authorization.json");

module.exports = function (req, res, next) {
  // si l'utilisateur est admin il a forcement le droit de passer
  logger.warn(req.user);
  logger.warn(req.user.type);
  if (req.user.type === "admin") {
    logger.debug("bypassing authorization middleware");
    next();
  } else {
    // logger.warn(Object.keys(req));
    // logger.debug("req.url", req.url);
    // logger.error("------------------------------------------------");
    // logger.debug("req.originalUrl", req.originalUrl);
    // logger.info("JSON de Config des droits", routeConfigs);
    // logger.warn(routeConfigs.dev.author.generate);
    // logger.warn(routeConfigs["dev"]["author"]["generate"]);
    var truc = routeConfigs["dev"];
    truc = truc["author"];
    truc = truc["generate"];
    // logger.debug(truc);
    // logger.info(req.originalUrl.substring(1));
    // logger.warn(req.originalUrl.split("/"));
    // logger.info(req.originalUrl.substring(1).split("/"));
    var splitUrl = req.originalUrl.substring(1).split("/");
    // logger.error("------------------------------------------------");
    if (req.user) {
      //boucle d'accession au tableau d'autorisations

      var value;

      // logger.debug("auth arr length", splitUrl.length);
      for (let i = 0; i < splitUrl.length; i++) {
        logger.debug("i", i);
        if (i === 0) {
          value = routeConfigs[`${splitUrl[i]}`]; // <=> value = routeConfigs.dev
        } else {
          value = value[`${splitUrl[i]}`]; // <=> ([0] value = value.dev [1] value = value.author [2] value = value.generate )
        }
        // logger.error(`split URL at ${i} >>${splitUrl[i]}<<`);
        // logger.warn(`value at ${i} >>${JSON.stringify(value)}<<`);
        // logger.log("after loop value", value);
      }
      // logger.log(req.user.type);
      if (value.find((elem) => elem === req.user.type)) {
        logger.debug("authorization Middleware passed");
        next();
      } else {
        logger.debug("authorization Middleware blocked");
        res.status(403).json({ message: "forbidden" });
      }
    }
  }
};

// module.exports = function (req, res, next) {
//   if (req.user.type === "admin") next();
//   var splitUrl = req.originalUrl.substring(1).split("/");
//   if (req.user) {
//     var value;
//     logger.debug("auth arr length", splitUrl.length);
//     for (let i = 0; i < splitUrl.length; i++) {
//       logger.debug("i", i);
//       if (i === 0) {
//         value = routeConfigs[`${splitUrl[i]}`];
//       } else {
//         value = value[`${splitUrl[i]}`];
//       }
//     }
//     if (value.find((elem) => elem === req.user.type)) {
//       next();
//     } else {
//       res.status(403).json({ message: "forbidden" });
//     }
//   } else {
//     res.status(500).json({ message: "unknown server error" });
//   }
// };
