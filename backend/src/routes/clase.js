const { Router } = require("express");
const router = Router();
const { verifyToken, esSocio , esProfesor, esAdministrador } = require("../middlewares");

router.route("/");
const {
    getClases,
    createClase,
    getClase,
    updateClase,
    deleteClase,
} = require("../controllers/clase.controllers.js");
router.route("/")
.get(getClases)
.post([verifyToken, esSocio], createClase);

router.route("/:id")
.get([verifyToken, esSocio], getClase)
.put([verifyToken, esProfesor], updateClase)
.delete([verifyToken, esProfesor], deleteClase);

module.exports = router;
