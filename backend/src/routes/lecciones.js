const { Router } = require("express");
const router = Router();
const { verifyToken, esSocio , esProfesor, esAdministrador } = require("../middlewares");

router.route("/");
const {
  getLecciones,
  createLeccion,
  updateLeccion,
  deleteLeccion,
  getLeccion,
} = require("../controllers/lecciones.controllers.js");
router.route("/")
.get(getLecciones)
.post([verifyToken, esSocio], createLeccion);

router.route("/:id")
.get([verifyToken, esSocio], getLeccion)
.put([verifyToken, esProfesor], updateLeccion)
.delete([verifyToken, esProfesor], deleteLeccion);

module.exports = router;
