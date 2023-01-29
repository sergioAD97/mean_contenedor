const { Schema, model } = require('mongoose');

const citaSchema = new Schema({
    title: String,
    //number: Number,
    content: {
        type: String,
        required: false
    },
    author: String,
    date: {
        type:Date,
        default: Date.now
    }
}, {
    timestaps: true
});

module.exports = model('Cita', citaSchema);