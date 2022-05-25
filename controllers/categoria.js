const categoria = require("../models/categoria");

const obtenerCategorias = async(req, res) => {
    
    const { limite = 5, desde = 0 }= req.query;
    const query ={ estado: true }; 

   
    const [ total, categorias ] = await Promise.all([
        categoria.countDocuments(query),
        categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        categorias
    })
}

const obtenerCategoria = async( req, res ) => {
    const { id } = req.params
    
    const Categoria = await categoria.findById( id ).populate('nombre', 'usuario')

    res.json(Categoria)
}

const actualizarCategoria = async(req,res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const Categoria = await categoria.findByIdAndUpdate( id, data, { new: true })

    res.json( Categoria )
}

const crearCategoria = async(req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await categoria.findOne({ nombre })

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    console.log( data )

    const Categoria = new categoria( data );
    
    await Categoria.save()

    res.status(201).json(Categoria)
}

const deleteCategoria = async(req, res = response) => {
    
    const { id } = req.params

    const Categoria = await categoria.findByIdAndUpdate(id, {estado : false })
     
    
    res.json(Categoria)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    deleteCategoria
}