const { Router } = require('express');
const router = Router();

const {singUp, singIn,forgotPassword,newPassword, emailAjax} = require('../controllers/auth.controllers.js')
const {checkDuplicateDocumentOrCodigoOrEmail, checkRolesExisted} = require('../middlewares')
//registrarse
router.route('/signUp')
    .post([checkDuplicateDocumentOrCodigoOrEmail, checkRolesExisted], singUp)
//iniciar session
router.route("/signIn")
    .post(singIn)
//ha olvidado su contraseña?
router.route("/forgot-password")
    .put(forgotPassword)
//link de restablecimiento de contraseña
router.route("/new-password")
    .put(newPassword)
router.route('/email/:email')
    .get(emailAjax)

module.exports = router;