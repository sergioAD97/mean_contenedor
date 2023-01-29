const { Schema, model } = require('mongoose');

const claseSchema = new Schema({
    titulo: String,
    autor1: String,
    socio1: String,
    codigo: Number,
    idHorario: String,
    dia: String,
    indice: String,
    solicita: String,
    horaSolicitud: String,
    date: {
        type:Date,
        default: Date.now
    }
}, {
    timestaps: true
});

module.exports = model('Clase', claseSchema);