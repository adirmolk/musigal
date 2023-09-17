const indexR = require("./index");
const usersR = require("./users");
const productsR = require("./products");
const songsR = require("./songs");
const vinylsR = require("./vinyls");


exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/products", productsR);
  app.use("/songs", songsR);
  app.use("/vinyls", vinylsR);

}

