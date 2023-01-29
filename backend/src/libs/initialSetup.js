const crtRole = {};
const Role = require("../models/Role");
const Empresa = require("../models/empresa");
const User = require("../models/User");
const mongoose = require('mongoose');


crtRole.createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return "existe";

    const values = await Promise.all([
      new Role({ name: "Administrador" }).save(),
      new Role({ name: "Canchero" }).save(),
      new Role({ name: "Profesor" }).save(),
      new Role({ name: "Socio" }).save(),
      //console.log("creados los roles")
    ]);
    //console.log(values);
    const values2 = await Promise.allSettled([
      console.log("creados los roles")
    ]);
  } catch (error) {
    console.log(error);
  }
};

crtRole.usuariosPorDefecto = async () => {
  try {
    setTimeout(async function(){
      let userDef = require("./usuariosPorDefecto.json");
      //este for separa por elementos y les encripta la contraseña
      for (let i = 0; i < userDef.length; i++) {
        if (userDef[i].rol) {
          const foundRoles = await Role.find({ name: { $in: userDef[i].rol } });
          userDef[i].rol = foundRoles.map((role) => role._id);
        } else {
          //si no se ingreso ningun rol, asigna el rol user por defecto
          const role = await Role.findOne({ name: "Socio" });
          userDef[i].rol = [role._id];
        }
        
        const newUser = new User( userDef[i]);
        newUser.contra = await newUser.cifrarPass(newUser.contra);
        userDef[i]=newUser;
      }
      //verificamos que la collecion user este vacia
      const count = await User.estimatedDocumentCount();
      //si esta vacia, insertamos los elementos
      if (count > 0) return "existe";
      const values = await Promise.all([
        User.insertMany(userDef),
        console.log("creados los usuarios por defecto")
      ]);
    }, 2000);
    
  } catch (error) {
    console.log(error);
  }
}
crtRole.EmpresaDefault = async () => {
  try {
    let empresa = require("./empresa.json");
    //verificamos que la collecion user este vacia
    const count = await Empresa.estimatedDocumentCount();
    //si esta vacia, insertamos los elementos
    if (count > 0) return "existe";
    const values = await Promise.all([
      //console.log(userDef),
      Empresa.insertMany(empresa),
      console.log("creados los datos de la empresa por defecto")

  ]);
  } catch (error) {
    console.log(error);
  }
}
module.exports = crtRole;
