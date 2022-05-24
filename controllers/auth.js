const { response } = require("express");
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const generarJWT = require("../helpers/generarJWT.JS");
const googleVerify = require("../helpers/google.validator");



const login =  async(req, res = response) => {

    const { correo, contraseña } = req.body
    
    // verificar si el email existe 
    const usuario = await Usuario.findOne({ correo });
    if(!usuario){
        return res.status(400).json({
            msg:"Usuario o contraseña invalido"
        })
    }
    // Verificar si el usuario esta activo 
    if( !usuario.estado){
        return res.status(400).json({
            msg:"Usuario o contraseña invalido. status: false "
        })
    }

    // Verificar si la contraseña es correcta 
    const validarContraseña = bcryptjs.compareSync( contraseña, usuario.contraseña )
    if ( !validarContraseña ){
        return res.status(400).json({
            msg:"contraseña Invalida"
        })
    }
    // Generar el JWTS
    const token = await generarJWT( usuario.id )

    try {   
        
    res.json({
        usuario,
        token
            
})
        
    } catch (error) {
        return res.status(500).json({
            msg: "Hay un error en su solicitud, por favor contacte a un administrador"
        })
    }
}

const googleSign = async(req, res) => {
    
    const { id_token } = req.body

    

    try {
        const {nombre, correo, img} = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo })

        if( !usuario ){
            const data = {
                nombre,
                correo,
                contraseña: "",
                img,
                google: true
            }
           
           usuario = new Usuario( data );
           await usuario
        
        }

        if( !usuario.estado ){
            return res.status(401).json({
                msg:"Usuario Bloqueado, contacte al administrador"
            })
        }

        const token = await generarJWT( usuario.id )

        res.json({
          usuario,
          token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "email no se puede verificar"
        })
    }
   
}


module.exports = {
    login,
    googleSign
}