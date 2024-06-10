const { isAdmin } = require("../../middlewares/auth");
const { getJuegos, getJuegosByID, postJuego, updateJuego, deleteJuego, insertJuegos } = require("../controllers/juego");
const juegosRouter = require("express").Router();

juegosRouter.get("/", getJuegos);
juegosRouter.get("/:id", getJuegosByID);
juegosRouter.post("/", isAdmin, postJuego);
juegosRouter.put("/:id", updateJuego);
juegosRouter.delete("/:id", isAdmin, deleteJuego);
juegosRouter.post("/send", isAdmin, insertJuegos);


module.exports = juegosRouter;