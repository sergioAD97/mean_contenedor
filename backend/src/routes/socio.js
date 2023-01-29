//const router
const { Router } = require('express');
const router = Router();
const {verifyToken, esProfesor, esSocio, esAdministrador, checkRolesExisted} = require('../middlewares')
//Rutas para el usuario socio
//Importamos el archivo controlador de las rutas con sus funciones 
const {getSocio, updateDataSocioId, updatePass} = require('../controllers/socio.controllers.js')
router.route('/:id')
    .get([verifyToken, esSocio], getSocio)
    .put([verifyToken, esSocio], updateDataSocioId)

router.route('/cambiarContra/:id')
    .put([verifyToken, esSocio], updatePass)


module.exports = router;