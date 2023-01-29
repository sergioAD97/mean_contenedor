const { Router } = require('express');
const router = Router();
const { verifyToken, esProfesor, esCanchero, esAdministrador, esSocio, checkRolesExisted, estaActivo } = require('../middlewares')

router.route('/')
const {getHorarios, getEsquemaHorarios, getEsquemaHorario, createHorario, updateHorario, deleteHorario, getHorario, activarHorario, MostrarTodoElHorario, regenerarHorario, horariosActivos, tituloHorario, solicitudHorario, asignarProfesor, editarAsistio, editarGranDemanda } = require('../controllers/horario.controllers.js')
router.route('/')
    .get(getHorarios)
    .post([verifyToken, estaActivo, esAdministrador], createHorario)

router.route('/esquema/')
    .get([verifyToken, estaActivo, esAdministrador], getEsquemaHorarios)

router.route('/esquema/:id')
    .get([verifyToken, estaActivo, esAdministrador], getEsquemaHorario)

router.route('/activos/')
    .get(horariosActivos)

router.route('/:id') 
    .get( getHorario)
    .put([verifyToken, estaActivo, esAdministrador], updateHorario)
    .delete([verifyToken, estaActivo, esAdministrador], deleteHorario)

router.route('/activar/:id')
    .put([verifyToken, estaActivo, esAdministrador], activarHorario)

router.route('/mostrarTodo/:id')
    .put([verifyToken, estaActivo, esAdministrador], MostrarTodoElHorario)
    
router.route('/regenerar/:id')
    .put([verifyToken, estaActivo, esAdministrador], regenerarHorario)

router.route('/solicitud/:id')
    .put([verifyToken, estaActivo, esSocio],solicitudHorario)

router.route('/titulo/:id')
    .put([verifyToken, estaActivo, esAdministrador], tituloHorario)

router.route('/configuracion/:id')
    .put([verifyToken, estaActivo, esProfesor], asignarProfesor)

router.route('/asistio/:id')
    .put([verifyToken, estaActivo, esCanchero], editarAsistio)

router.route('/granDemanda/:id')
    .put([verifyToken, estaActivo, esAdministrador], editarGranDemanda)

module.exports = router;