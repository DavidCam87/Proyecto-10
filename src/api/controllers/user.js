const { generateSing } = require("../../utils/jwt");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const user = await User.find().populate("favoritos");
    await res.status(200).json(user);
  } catch (error) {
    return res.status(404).json("error");
  }
};

const getUsersByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("favoritos");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json("error");
  }
}

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({ userName: req.body.userName });
    if (userDuplicated) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      rol: "user"
    });
    const user = await newUser.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(404).json("error");
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSing(user._id);
      return res.status(200).json({ token, user });
    }
    return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
  } catch (error) {
    return res.status(404).json("error");
  }
}
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { userName, email, rol, favoritos } = req.body;
  const { rol: userRole, _id } = req.user;

  if (userRole === "admin" || _id.toString() === id) {
    const updateObject = { userName, email, rol, favoritos };

    // Elimino propiedades undefined del objeto updateObject
    Object.keys(updateObject).forEach(key => updateObject[key] === undefined && delete updateObject[key]);

    try {
      const userUpdated = await User.findByIdAndUpdate(id, updateObject, { new: true });
      if (!userUpdated) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      return res.status(200).json(userUpdated);
    } catch (error) {
      return res.status(500).json({ error: "Error al actualizar el usuario", details: error.message });
    }
  }
  return res.status(401).json({ error: "No tienes permiso para modificar este usuario" });
}

const deleteUser = async (req, res, next) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      mensaje: "usuario eliminado con exito",
      userDeleted
    });
  } catch (error) {
    return res.status(500).json("error en el Delete" + error.message);
  };
};

module.exports = {
  getUsers, getUsersByID, register, login, updateUser, deleteUser
}