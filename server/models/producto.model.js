const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categorias',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    }
});

module.exports = mongoose.model('Productos', productoSchema);