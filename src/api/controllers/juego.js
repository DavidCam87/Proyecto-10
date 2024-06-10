const Juego = require("../models/juego");
const juego = require("../../../products.json")

const getJuegos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const juegos = await Juego.find().skip(skip).limit(limit);
    const totalJuegos = await Juego.countDocuments();
    const totalPages = Math.ceil(totalJuegos / limit);

    res.json({
      page,
      totalPages,
      totalJuegos,
      juegos
    });
  } catch (error) {
    return res.status(404).json("error");
  }
};

const getJuegosByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const juego = await Juego.findById(id);
    return res.status(200).json(juego);
  } catch (error) {
    return res.status(404).json("error");
  }
}

const postJuego = async (req, res, next) => {
  try {
    const newJuego = new Juego(req.body);
    const juego = await newJuego.save();
    return res.status(201).json(juego);
  } catch (error) {
    return res.status(404).json("error");
  }
}

const updateJuego = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newJuego = req.body;
    const juegoUpdated = await Juego.findByIdAndUpdate(id, newJuego, { new: true });

    if (!juegoUpdated) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    return res.status(200).json(juegoUpdated);
  } catch (error) {
    return res.status(404).json("error");
  }
}

const deleteJuego = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedJuego = await Juego.findByIdAndDelete(id);
    return res.status(200).json({
      mensaje: "Juego Eliminado Con Exito!!!",
      juegoEliminado: deletedJuego,
    });
  } catch (error) {
    return res.status(404).json("error");
  }
}

const insertJuegos = async (req, res, next) => {
  try {
    await Juego.insertMany(juego.results)
    return res.status(201).json("productos subidos a BBDD")
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  getJuegos, getJuegosByID, postJuego, updateJuego, deleteJuego, insertJuegos
}