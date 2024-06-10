const mongoose = require("mongoose");

const juegoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  caratula: { type: String, required: true },
  valoracion: { type: Number, required: false }

}, {
  timestamps: true,
  collection: "juegos"
});

const Juego = mongoose.model("juegos", juegoSchema, "juegos");
module.exports = Juego;