const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, deleteProducto } = require('../controllers/producto');
const { IdCategoriaExiste, IdProductoExiste } = require('../helpers/db-validator');

const { validacion } = require('../middlerwares/validacion');
const validarJWT = require('../middlerwares/validar-jwt');
const { TieneRol } = require('../middlerwares/validar-rol');


const router = Router()

//Obtener todos los productos -- publico

router.get('/', obtenerProducto)

//Obtener productos por Id -- Publico

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( IdProductoExiste ),
    validacion
], obtenerProductos )

// Crear Categoria -- Privado -- Cualquier Usuario con un Token Valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom( IdCategoriaExiste ),
    validacion
], crearProducto)

// Modificar Producto -- Privado -- Cualquier Usuario con un token valido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom( IdProductoExiste ),
    validacion
], actualizarProducto )

// Eliminar Producto -- Privado -- Solo usuario ADMIN_ROLE. Cambia estado a false
router.delete('/:id', [
    validarJWT,
    TieneRol("ADMIN_ROLE"),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( IdProductoExiste ),
    validacion
], deleteProducto)

module.exports = router