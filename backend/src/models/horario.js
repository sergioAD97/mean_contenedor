const { Schema, model } = require('mongoose');

const horarioSchema = new Schema({
    activo: Boolean,
    regenerar: Boolean,
    lugar: String,
    fechaInicio: String,
    mostrarTodo: Boolean,
    horario: [{ type: Object, properties: 
    {   //array de horas
        indice: Number,
        franja: String,
        granDemanda: Boolean,
        dia: [{type: Object, properties: 
        {   //array de dias
            dia: String,
            fecha: String,
            turno: String,
            autor1: String, //id del socio que realiza la solicitud
            socio1: String,  //nombre del socio que realiza la solicitud
            codigo: String, //codigo del socio 
            autor2: String,
            socio2: String,
            autor3: String,
            socio3: String,
            autor4: String,
            socio4: String,
            horaSolicitud: String,
            solicita: String,
            asistio: Boolean,
            idProfesor: String,
            colorProfesor: String,
            profesor: String,
            idCanchero: String,
            canchero: String,
        }}]
    }}]
}, {
    timestaps: true
});

module.exports = model('Horario', horarioSchema);