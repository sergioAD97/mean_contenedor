const { Schema, model } = require('mongoose');

const ImgempresaSchema = new Schema({
    imagen: String,
    //number: Number,
    ver: Boolean,
    presentar: Boolean
    
    }, {
    timestaps: true
});

ImgempresaSchema.methods.setImagen = function setImagen (filename) {
    //const {host, port} = config
    this.imagen = `http://localhost:4000/publicEmpresa/${filename}`
    }

module.exports = model('ImgEmpresa', ImgempresaSchema);