//const router
const { Router } = require('express');
const router = Router();
const {verifyToken, esProfesor, esSocio, esAdministrador, checkRolesExisted} = require('../middlewares')
//Rutas para el usuario socio
//Importamos el archivo controlador de las rutas con sus funciones 
const {getInfoProfesor, getProfesor, updateDataProfesorId, updatePass} = require('../controllers/profesor.controllers.js')
router.route('/')
    .get(getInfoProfesor)
router.route('/:id')
    .get([verifyToken, esSocio], getProfesor)
    .put([verifyToken, esSocio], updateDataProfesorId)

router.route('/cambiarContra/:id')
    .put([verifyToken, esSocio], updatePass)


module.exports = router;