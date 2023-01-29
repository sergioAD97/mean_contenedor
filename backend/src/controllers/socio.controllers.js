const socioCtrl = {};
const User = require("../models/User");

socioCtrl.getSocio = async (req, res) => {
  const users = await User.find().populate("rol");
  res.json(users);
  //console.log(users);
};

//id
socioCtrl.getSocio = async (req, res) => {
  const user = await User.findById(req.params.id).populate("rol");
  console.log(user); //mostrar por consola
  //res.json({message:user})
  res.json({ message: user });
};


socioCtrl.updateDataSocioId = async (req, res) => {
  console.log(req.params.id, req.body);
  const {
    nombre,
    celular,
    email,
    codigo,
    telefono2,
    direccion,
    documento
    //,
    //grupoFamiliar
  } = req.body;
  const updateUser = new User({
    nombre,
    celular,
    email,
    codigo,
    telefono2,
    direccion,
    documento
    //,
    //grupoFamiliar
  });
  console.log(updateUser);
  await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: {
      //updateUser
      nombre: updateUser.nombre,
      celular: updateUser.celular,
      email: updateUser.email,
      codigo: updateUser.codigo,
      telefono2: updateUser.telefono2,
      direccion: updateUser.direccion,
      documento: updateUser.documento
    }}
  );
  res.json({ message: "usuario actualizado" });
};



//actualizar contraseña
socioCtrl.updatePass = async (req, res, next) => {
  try {
      const userFound = await User.findOne({ _id: req.params.id });
      if (!userFound) return res.status(400).json({ message: "No se encontró el usuario especificado" });
      const matchPassword = await User.comparePassword(
          req.body.contraAntigua,
          userFound.contra,
      ); 
      if (!matchPassword)
        return res.status(401).json({
          token: null,
          message: "Las contraseñas no coinciden",
      }); 
      const updateUser = new User({
        contra: req.body.contraNueva
      }); 
      updateUser.contra = await updateUser.cifrarPass(updateUser.contra); 
      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: {contra: updateUser.contra} }
      );
      res.json({ message: "contraseña actualizada" });

  } catch (error) {
      console.log(error);
    }
  };


    

module.exports = socioCtrl;
