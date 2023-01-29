const authCtrl = {};
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Role = require("../models/Role");
const transporter = require("../config/mailer.js");
const nodemailer = require('nodemailer');

//registrarse
authCtrl.singUp = async (req, res) => {
  try {
    const {
      nombre,
      celular,
      contra,
      email,
      imagen,
      codigo,
      documento,
      idFamiliar,
      telefono2,
      direccion,
      rol,
      color,
      fechaNacimiento,
      estatura,
      genero,
      barrio,
      peso,
      categoria,
      torneos,
      brazoDominante,
    } = req.body;
    //restricciones
    const verificaEmail = await User.findOne({ email: req.body.email })
    if (verificaEmail)  return res.status(400).json({ message: "El email ya se encuentra registrado" });
    const verificaCodigo = await User.findOne({ codigo: req.body.codigo })
    if (verificaCodigo)  return res.status(400).json({ message: "El codigo ya se encuentra registrado" });
    const verificaDocumento = await User.findOne({ documento: req.body.documento })
    if (verificaDocumento)  return res.status(400).json({ message: "El documento ya se encuentra registrado" });
    //en la carpeta libs se valida si existe el usuario
    //const userFound = User.find({email})
    const newUser = new User({
      nombre,
      celular,
      contra,
      email,
      imagen,
      codigo,
      documento,
      activo:"false",
      idFamiliar,
      telefono2,
      direccion,
      rol,
      color,
      fechaNacimiento,
      estatura,
      genero,
      barrio,
      peso,
      categoria,
      torneos,
      brazoDominante,
    });
    newUser.contra = await newUser.cifrarPass(newUser.contra);

    //busca los roles que se ingresan
    if (rol) {
      const foundRoles = await Role.find({ name: { $in: rol } });
      newUser.rol = foundRoles.map((role) => role._id);
    } else {
      //si no se ingreso ningun rol, asigna el rol user por defecto
      const role = await Role.findOne({ name: "Socio" });
      newUser.rol = [role._id];
    }
    //imagen
    //console.log(File.name)
    const savedUser = await newUser.save();
    //const savedUser = await newUser;
    console.log(newUser);

    const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
      expiresIn: 60 * 60, //una hora
    });
    res.status(200).json({ token, savedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//logearse
authCtrl.singIn = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "rol"
    );

    if (!userFound)  return res.status(400).json({ message: "No se encontró el correo ingresado" });

    const matchPassword = await User.comparePassword(
      req.body.contra,
      userFound.contra
    );
    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Contraseña incorrecta",
      });

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      //expiresIn: 86400, // 24 hours
      expiresIn: 1800, // 18 minutes
    });

    res.json({ token, userFound });
  } catch (error) {
    console.log(error);
  }
};

authCtrl.forgotPassword = async (req, res) => {
  const {email} =req.body;
  if (!(email)) {
    return res.status(400).json({message: "el email es requerido"});
  }
  
  const message = "Revisa tu correo electronico para cambiar tu contraseña";
  let verificationLink;
  let emailStatus = "OK";
  
  try {
    const userFound = await User.findOne({ email: req.body.email });
    console.log(userFound)
    if (!userFound) {
      console.log("no se encontro el correo electronico")
      return res.status(400).json({ message: "Revise su correo electronico" });
    } 
    console.log("email encontrado")

    const token = jwt.sign({id: userFound._id, email : userFound.email}, config.jwtSecretReset, {expiresIn: '10m'});
    verificationLink = `http://localhost:3000/new-password/${token}`;
    userFound.resetToken = token;

  //TODO: sendEmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'citagenda50@gmail.com', // generated ethereal user
        pass: 'pjkpcxsetiqnyflj', // generated ethereal password
      },
      tls: {
        rejectUnautorized: false 
      }
    });
    emailUser = userFound.email
    console.log(emailUser)
    const info = await transporter.sendMail({
      from: '"Restablecimiento de contraseña" <citagenda50@gmail.com>', // sender address
      to: emailUser, // list of receivers
      subject: "Restablecimiento de contraseña", // Subject line
      text: "Se ha solicitado restablecer la contraseña de este usuario", // plain text body
      html: `
        <b>Da click en el siguiente enlace para redireccionarse al modulo de cambio de contraseña o copie el link en su navegador </b>
        <a href="$verificationLink">${verificationLink}</a>
      `, // html body
    });
    console.log(info)

    await userFound.save();
  } catch (error) {
    emailStatus = error;
    console.log(error)
    return res.status(400).json({ message: "algo no ha ido bien"});
  }
  res.json({ message, info: emailStatus});




}


authCtrl.newPassword = async (req, res) => {
  try{
  const{newPassword} = req.body;
  const resetToken = req.headers.reset;

  if(!(resetToken && newPassword)){
    res.status(400).json({message: "todos los campos son requeridos"});
  }
    const userFound = await User.findOne({ resetToken: req.headers.reset })
    userFound.contra = newPassword;
    userFound.contra = await userFound.cifrarPass(userFound.contra);
    console.log(userFound.contra)
    await userFound.save();
  } catch (error) {
    console.log(error)
    return res.status(401).json({message: "algo no se guardo"})
  }
  res.json({message: "contraseña actualizada"})
}


authCtrl.emailAjax = async (req, res) => {
  try{
    console.log(req.body)
    const verificaEmail = await User.findOne({ email: req.params.email })
    if (verificaEmail)  return res.status(200).json(true);
    else return res.status(200).json(false);
  } catch (error) {
    console.log(error)
    return res.status(401).json({message: "algo no se guardo"})
  }
}


module.exports = authCtrl;
