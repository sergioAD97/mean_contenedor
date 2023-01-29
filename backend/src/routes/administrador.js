//const router
const { Router } = require('express');
const router = Router();
const {verifyToken, esProfesor, esAdministrador, estaActivo, checkRolesExisted} = require('../middlewares')
//Rutas para los usuarios
//Importamos el archivo controlador de las rutas con sus funciones 
const {getUsers, createUser, updateUserId, deleteUserId, getUserId, getUserDocumento, updateUserDocumento, deleteUserDocumento, getUserCodigo, updateUserCodigo, deleteUsercodigo} = require('../controllers/users.controllers.js')
router.route('/')
    //.get([verifyToken, esProfesor], getUsers)
    //.get([verifyToken], getUsers)
    .get( getUsers)
    //.post(createUser)
    .post([verifyToken, esAdministrador, estaActivo, checkRolesExisted], createUser)
router.route('/:id') 
//para el id
    .get([verifyToken, estaActivo, esProfesor], getUserId)
    .put([verifyToken, esAdministrador, estaActivo, checkRolesExisted], updateUserId)
    .delete([verifyToken, estaActivo, esAdministrador], deleteUserId)
router.route('/documento/:documento') 
//para documento
    .get([verifyToken, estaActivo, esProfesor], getUserDocumento)
    .put([verifyToken, estaActivo, esAdministrador, checkRolesExisted], updateUserDocumento)
    .delete([verifyToken, estaActivo, esAdministrador], deleteUserDocumento)
router.route('/codigo/:codigo') 
//para codigo
    .get([verifyToken, estaActivo, esProfesor], getUserCodigo)
    .put([verifyToken, estaActivo, esAdministrador, checkRolesExisted], updateUserCodigo)
    .delete([verifyToken, estaActivo, esAdministrador], deleteUsercodigo)
module.exports = router;