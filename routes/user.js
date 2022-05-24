const { Router } = require('express');
const { check } = require('express-validator');
const { validacion } = require('../middlerwares/validacion');
const { getUsuario, 
        putUsuario, 
        postUsuario, 
        patchUsuario, 
        deleteUsuario } = require('../controllers/user');
const {ValidarRol, emailExiste, IdUsuarioExiste }= require('../helpers/db-validator');
const validarJWT = require('../middlerwares/validar-jwt');
const { TieneRol } = require('../middlerwares/validar-rol');





const router = Router();

router.get('/', getUsuario )   //obtener Informacion del usuario o de la fuente

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('contraseña', 'La contraseña debe ser de minimo 6 caracteres').isLength({ min: 6}),
        check('correo', 'el correo no es valido').isEmail(),
        check('correo').custom( emailExiste ),
      //check('rol', 'Este rol es invalido').isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check('rol').custom( ValidarRol ),
        validacion
], postUsuario ) //Crea y sube nueva informacion al backend

router.put('/:id',[
        check('id', "No es un ID valido").isMongoId(),
        check('id').custom( IdUsuarioExiste ),
        validacion
], putUsuario ) //Crea informacion (cod: 201) o edita informacion del backend (cod:200 o 203)

router.patch('/', patchUsuario ) //Edita parcialmente una informacion del backend

router.delete('/:id', [
        validarJWT,
        //AdminRol,
        TieneRol("ADMIN_ROLE"),
        check('id', "No es un ID valido").isMongoId(),
        check('id').custom( IdUsuarioExiste ),
        
], deleteUsuario ) // Elimina el recurso señalado en su totalidad (cod:200 - 202) 
                                   // o parcialmente (cod: 204)

// La diferencia entre el put y el patch es que el put es usado para editar
// parcialmente una informacion; es recomendable que si se va a reemplazar todo
// el objeto del backend se use el put.


module.exports = router;