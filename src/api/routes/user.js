const { isAuth, isAdmin } = require("../../middlewares/auth");
const { getUsers, getUsersByID, login, register, updateUser, deleteUser } = require("../controllers/user");

const usersRouter = require("express").Router();

usersRouter.get("/", isAdmin, getUsers);
usersRouter.get("/:id", isAuth, getUsersByID);
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.put("/:id", isAuth, updateUser);
usersRouter.delete("/:id", isAdmin, deleteUser);

module.exports = usersRouter;