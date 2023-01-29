const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require("../config");

const userSchema = new Schema({
    nombre: String,
    codigo:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    documento:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    resetToken:String,
    imagen: String,
    celular:String,
    activo: Boolean,
    idFamiliar: String,
    contra: String,
    telefono2: String,
    direccion: String,
    color: String,
    fechaNacimiento: String,
    estatura: String,
    genero: String,
    barrio: String,
    peso: String,
    categoria: String,
    torneos: String,
    brazoDominante: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    rol: [{
        ref: "Role",
        type: Schema.Types.ObjectId //para relacionarlo con el rol
    }]
}, {
    timestaps: true,
    versionKey: false
});


userSchema.methods.cifrarPass = async (contra) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contra, salt);
};
userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

userSchema.methods.setImagen = function setImagen (filename) {
//const {host, port} = config
this.imagen = `http://localhost:4000/public/${filename}`
}

module.exports = model('User', userSchema);