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
  try {
    const { id } = req.params;
    if (req.user.rol === "admin" || req.user._id.toString() === id) {
      const updateUserData = req.body;

      // Solo actualiza los campos que están presentes en el request body
      const updateObject = {};
      if (updateUserData.userName) updateObject.userName = updateUserData.userName;
      if (updateUserData.email) updateObject.email = updateUserData.email;
      if (updateUserData.rol) updateObject.rol = updateUserData.rol;
      if (updateUserData.favoritos) updateObject.favoritos = updateUserData.favoritos;

      const userUpdated = await User.findByIdAndUpdate(id, updateObject, { new: true });
      return res.status(200).json(userUpdated);
    }

    return res.status(401).json({ error: "No se puede modificar este usuario ya que no eres tu." });
  } catch (error) {
    return res.status(500).json({ error: "error al actualizar usuario" });
  }
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