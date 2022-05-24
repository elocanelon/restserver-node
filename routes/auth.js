const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSign } = require('../controllers/auth');
const { validacion } = require('../middlerwares/validacion');


const router = Router();

router.post("/login",[
    check('correo', 'el correo debe ser obligatorio').isEmail(),
    check('contraseña', 'La contraseña debe ser obligatoria').not().isEmpty(),
    validacion
], login )

router.post("/google",[
    check('id_token', "El id_token es necesario").not().isEmpty(),
    validacion
], googleSign )

module.exports = router