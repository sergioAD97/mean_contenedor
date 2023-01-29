const { Schema, model } = require('mongoose');
//export const ROLES = ["user","admin","moderador"] //equivale a 
module.exports.ROLES = ["user","admin","moderador"]

const rolSchema = new Schema(
{
    name: String,
},
{
    versionKey: false,
}
);
module.exports = model('Role', rolSchema);