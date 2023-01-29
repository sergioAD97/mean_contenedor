const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Role = require("../models/Role");
const bcrypt = require('bcryptjs');

module.exports.verifyToken = async (req, res, next) => {
  //const token = req.headers['x-access-token'];
  try {
    const token = req.headers["x-access-token"];
    console.log(token);
    //console.log('token')
    if (!token) {
      return res.status(403).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};
module.exports.esSocio = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const rol = await Role.find({ _id: { $in: user.rol } });
  for (let i = 0; i < rol.length; i++) {
    if (rol[i].name === "Socio" || rol[i].name === "Profesor" || rol[i].name === "Administrador" || rol[i].name === "Canchero") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Requiere el rol de Socio" });
};

module.exports.esCanchero = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const rol = await Role.find({ _id: { $in: user.rol } });
  for (let i = 0; i < rol.length; i++) {
    if (rol[i].name === "Canchero" || rol[i].name === "Profesor"|| rol[i].name === "Administrador"){
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Requiere el rol de Canchero" });
};

module.exports.esProfesor = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const rol = await Role.find({ _id: { $in: user.rol } });
  for (let i = 0; i < rol.length; i++) {
    if (rol[i].name === "Profesor" || rol[i].name === "Administrador"){
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Requiere el rol de Profesor" });
};

module.exports.esAdministrador = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const rol = await Role.find({ _id: { $in: user.rol } });
  for (let i = 0; i < rol.length; i++) {
    if (rol[i].name === "Administrador") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Requiere el rol de Administrador" });
};

//esta activo?
module.exports.estaActivo = async (req, res, next) => {
  const user = await User.findById(req.userId);
  //const rol = await Role.find({ _id: { $in: user.rol } });
    if (user.activo === true) {
      next();
      return;
    }
  return res.status(403).json({ message: "Este usuario no ha sido activado, pongase en contacto con su administrador" });
};
// module.exports = authJwtCtrl;
