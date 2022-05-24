const express = require('express');
//require('dotenv').config()
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT

        //Conectar Base de dato
        this.contectarDB()

        //Ruta Api de los servidores 
        this.usuariosPath = "/api/users"
        this.authPath = "/api/auth"

        //middleware:Funciones que van a agregar mas funcionalidad al servidor
        this.middlewares();

        //Rutas de mi app
        this.routes(); 
    }

    async contectarDB(){
       await dbConnection()
    }

    middlewares(){
        
        //Cors 
        this.app.use( cors() )
        
        // Directorio Publico
        this.app.use( express.static('public'))  

        // Lectura y paseo del body 
        this.app.use( express.json() )
    }

    routes(){
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/user'))
        }
    
      listen(){
        this.app.listen( process.env.PORT, () => {
            console.log('Servidor corriendo en el servidor ' + process.env.PORT)
        })
    }

}

module.exports= Server 