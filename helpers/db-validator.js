const categoria = require('../models/categoria');
const producto = require('../models/producto');
const Role = require('../models/rol')
const Usuario = require('../models/usuario')


const ValidarRol = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
          throw new Error(`el rol ${ rol } no esta registrado en la Base de datos`)
    }
  }


const emailExiste = async( correo='') => { 
const CorreoValido =  await Usuario.findOne({ correo })
    if ( CorreoValido ){
      throw new Error(`El correo ya se encuentra registrado`)
  }
}

const IdUsuarioExiste = async( id ) => { 
  const UsuarioExiste =  await Usuario.findById(id)
      if ( !UsuarioExiste ){
        throw new Error(`No existe usuario con este Id`)
    }
  }
  

  const IdCategoriaExiste = async( id ) => { 
    const categoriaExiste =  await categoria.findById(id)
        if ( !categoriaExiste ){
          throw new Error(`No existe categoria con este Id`)
      }
    }
    
  const IdProductoExiste = async( id ) => { 
    const ProductoExiste =  await producto.findById(id)
        if ( !ProductoExiste ){
          throw new Error(`No existe producto con este Id`)
        }
    }

module.exports = {
  ValidarRol,
  emailExiste,
  IdUsuarioExiste,
  IdCategoriaExiste,
  IdProductoExiste
}