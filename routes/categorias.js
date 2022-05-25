const { Router } = require('express');
const { check } = require('express-validator');
const {crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, deleteCategoria} = require('../controllers/categoria');
const { IdCategoriaExiste } = require('../helpers/db-validator');
const { validacion } = require('../middlerwares/validacion');
const validarJWT = require('../middlerwares/validar-jwt');
const { TieneRol } = require('../middlerwares/validar-rol');

const router = Router();

// Obtener todas las categorias --Publico
router.get('/', obtenerCategorias)

// Obtener una categoria por ID -- Publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( IdCategoriaExiste ),
    validacion,    
], obtenerCategoria)

// Crear una categoria -- Privado -- Cualquier persona con token Valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validacion
], crearCategoria)
    

// Actualizar o editar una categoria
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( IdCategoriaExiste ),
    validacion
], actualizarCategoria)

//Borrar una categoria -- Privada -- Solo administrador cambia el estado de la categoria en false
router.delete('/:id',[
    validarJWT,
    TieneRol("ADMIN_ROLE"),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( IdCategoriaExiste ),
    validacion
], deleteCategoria)

module.exports = router