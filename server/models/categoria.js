const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema

let categorisSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'nombre es requerido']
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

categorisSchema.plugin(uniqueValidator, { message: '{PATH} de se ser unico' })
module.exports = mongoose.model('Categoria', categorisSchema)