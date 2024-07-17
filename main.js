require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const juegosRouter = require("./src/api/routes/juego");
const usersRouter = require("./src/api/routes/user");
const cors = require("cors");


const app = express();
const PORT = 3000;
connectDB();
app.use(cors());
app.use(express.json());


app.use("/api/v1/juegos", juegosRouter);
app.use("/api/v1/users", usersRouter);


app.use("*", (req, res, next) => {
  return res.status(404).json("Rute not foud 🤬🤬😭🤬🤬")

});
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT} 👌🏼🆗😃🆗👌🏼`);
});