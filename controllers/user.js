const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const getUsuario = async(req, res = response ) => {
    
    const { limite = 5, desde = 0 }= req.query;
    const query ={ estado: true }; 

   
    const [ total, usuario ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        usuario
    })
}

const putUsuario = async(req, res = response) => {
    
    const id = req.params.id
    const { _id, contraseña, google , correo, ...resto } =req.body
    
    // Por hacer. Validad contra base de dato 
    if(contraseña){
        const salt = bcryptjs.genSaltSync();
        resto.contraseña = bcryptjs.hashSync( contraseña, salt )
        
    }
    
    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json({
        usuario
    })
  }

const postUsuario = async(req, res = response ) => {
    

    const { nombre, correo, contraseña, rol} = req.body
    const usuario = new Usuario( {nombre, correo, contraseña, rol} )


    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.contraseña = bcryptjs.hashSync( contraseña, salt )
    
    // Guardar en DB
    await usuario.save();

    res.json({
       usuario
    
    })
  }

const patchUsuario = (req, res = response) => {
    res.json({
        msg: "patch Api-Controlador"
    })
  }

const deleteUsuario = async(req, res = response) => {
    
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, {estado : false })
     
    
    res.json(usuario)
}



module.exports={
    getUsuario,
    putUsuario,
    postUsuario,
    patchUsuario,
    deleteUsuario
}