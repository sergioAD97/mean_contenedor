//hace la confirmacion
//const {ROLES} = require('../models/Role')
const User = require("../models/User");
const ROLES = ["Socio", "Profesor", "Administrador"];
module.exports.checkDuplicateDocumentOrCodigoOrEmail = async (req, res, next) => {
   const document = await User.findOne({ nombre: req.body.documento });
   if (document) return res.status(400).json({ message: "el número de documento ya se encuentra registrado." });
  //  const nombre = await User.findOne({ nombre: req.body.nombre });
  //  if (nombre) return res.status(400).json({ message: "el nombre ya se encuentra registrado" });
  const code = await User.findOne({ nombre: req.body.codigo });
  if (code) return res.status(400).json({ message: "ya existe un usuario con este código." });

  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).json({ message: "el email ingresado ya se encuentra en nuestra base de datos." });

  next();
};

module.exports.checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    console.log(req.body.roles);
    for (let i = 0; i < req.body.roles.length; i++) {
      //no se hara consulta por que son pocos roles
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Rol ${req.body.roles[i]} no existe`,
        });
      }
    }
  }
  next();
};
