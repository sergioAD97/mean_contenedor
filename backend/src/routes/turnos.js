const { Router } = require("express");
const router = Router();

const { verifyToken , esSocio , esProfesor, esAdministrador } = require("../middlewares");

router.route("/");
const {
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno,
  getTurno,
} = require("../controllers/turno.controllers.js");
router.route("/")
  .get(getTurnos)
  //router.get('/', verifyToken, getTurnos)  //OTRA MANERA DE ESCRIBIR LA LINEA ANTERIOR
  .post([verifyToken, esSocio], createTurno);
router.route("/:id")
  .get([verifyToken, esSocio], getTurno)
  .put([verifyToken, esProfesor], updateTurno)
  .delete([verifyToken, esProfesor], deleteTurno);

module.exports = router;
