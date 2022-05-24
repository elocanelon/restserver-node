const AdminRol = (req, res, next) => {

    if ( !req.usuario ){
        return res.status(500).json({
            msg:"Se quiere verificar el usuario sin haber hecho autenticacion"
        })
    }
    
        const { rol, nombre } = req.usuario
    
        if (rol !== "ADMIN_ROLE"){
            return res.status(401).json({
                msg:`este usuario ${nombre} no esta autorizado para dicha accion`
            })
        }
        next()
    }
    
    const TieneRol = ( ...roles ) => {
        
        return ( req, res, next ) =>{
            if ( !req.usuario ){
                return res.status(500).json({
                    msg:"Se quiere verificar el usuario sin haber hecho autenticacion"
                })
            }
    
            if( !roles.includes( req.usuario.rol)){
                return res.status(401).json({
                    msg: `Es servicio requiere uno de los siguientes roles ${roles}`
                })
            }
            
        }
    
    
    }
    module.exports= {
        AdminRol,
        TieneRol
    }