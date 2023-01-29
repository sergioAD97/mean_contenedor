const { Schema, model } = require('mongoose');

const leccionSchema = new Schema({
    Título: String,
    Jugador: String,
    Código: Number,
    Cantidad: Number,
    Clase1: String,
    Hora1: String,
    Entrenador1: String,
    Clase2: String,
    Hora2: String,
    Entrenador2: String
    ,
    date: {
        type:Date,
        default: Date.now
    }
}, {
    timestaps: true
});

module.exports = model('Leccion', leccionSchema);