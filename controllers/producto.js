const producto = require("../models/producto");


const obtenerProducto = async(req, res) => {
    
    const { limite = 5, desde = 0 }= req.query;
    const query ={ estado: true }; 

   
    const [ total, Producto ] = await Promise.all([
        producto.countDocuments(query),
        producto.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        Producto
    })
}


const obtenerProductos = async( req, res ) => {
    const { id } = req.params
    
    const Producto = await producto.findById( id ).populate('nombre', 'usuario')

    res.json( Producto )
}


const crearProducto = async(req, res) => {

    const { estado, usuario, ...body } = req.body

    const ProductoDB = await producto.findOne({ nombre: body.nombre })

    if( ProductoDB ){
        return res.status(400).json({
            msg: `El Producto ${ProductoDB.nombre} ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }

    console.log( data )

    const Producto = new producto( data );
    
    await Producto.save()

    res.status(201).json(Producto)
}

const actualizarProducto = async(req,res) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const Producto = await producto.findByIdAndUpdate( id, data, { new: true })

    res.json( Producto )
}

const deleteProducto = async(req, res = response) => {
    
    const { id } = req.params

    const Producto = await producto.findByIdAndUpdate(id, {estado : false }, {new: true })
     
    
    res.json(Producto)
}

module.exports = { 
    obtenerProducto,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    deleteProducto
}