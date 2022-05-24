const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');



async function validarJWT(req, res, next) {

    const token = req.header('auth-key');

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETEPUBLICKEY);

        const usuario = await Usuario.findById(uid);
       
        
        if( !usuario ){
            return res.status(401).json({
                msg:"Token no valido- Usuario no existe en DB"
        })
    }

       req.usuario = usuario;

        if( !usuario.estado ){
            return res.status(401).json({
                msg:"Token no valido- Usuario estatus false"
            })
        }  

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "No hay token en la peticion"
        });
    }


}

module.exports = validarJWT