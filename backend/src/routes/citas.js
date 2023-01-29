const { Router } = require('express');
const router = Router();

router.route('/')
const {getCitas, createCita, updateCita, deleteCita, getCita} = require('../controllers/citas.controllers.js')
router.route('/')
    .get(getCitas)
    .post(createCita)

router.route('/:id') 
    .get(getCita)
    .put(updateCita)
    .delete(deleteCita)
    
module.exports = router;