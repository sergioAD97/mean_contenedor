const leccionCtrl = {};

const Leccion = require("../models/Leccion");

leccionCtrl.getLecciones = async (req, res) => {
  const leccion = await Leccion.find(); //
  res.json(leccion);
};
leccionCtrl.createLeccion = async (req, res) => {
  const {
    Título,
    Jugador,
    Código,
    Cantidad,
    Clase,
    Hora,
    Entrenador,
    Clase1,
    Hora1,
    Entrenador1,
    Clase2,
    Hora2,
    Entrenador2,
  } = req.body;
  const nuevaLeccion = new Leccion({
    Título,
    Jugador,
    Código,
    Cantidad,
    Clase,
    Hora,
    Entrenador,
    Clase1,
    Hora1,
    Entrenador1,
    Clase2,
    Hora2,
    Entrenador2,
  });
  await nuevaLeccion.save();
  console.log(nuevaLeccion);
  //res.json({message:nuevaCita});
  res.json({ message: "leccion guardada" });
};

leccionCtrl.getLeccion = async (req, res) => {
  const leccion = await Leccion.findById(req.params.id);
  res.json({ message: leccion });
};
leccionCtrl.updateLeccion = async (req, res) => {
  console.log(req.params.id, req.body);
  const {
    Título,
    Jugador,
    Código,
    Cantidad,
    Clase1,
    Hora1,
    Entrenador1,
    Clase2,
    Hora2,
    Entrenador2,
  } = req.body;
  await Leccion.findOneAndUpdate({ _id: req.params.id }, {
    Título,
    Jugador,
    Código,
    Cantidad,
    Clase1,
    Hora1,
    Entrenador1,
    Clase2,
    Hora2,
    Entrenador2,
  });
  res.json({ message: "leccion actualizado" });
};

leccionCtrl.deleteLeccion = async (req, res) => {
  const leccion = await Leccion.findByIdAndDelete(req.params.id);
  res.json({ title: "Leccion eliminada" });
};

module.exports = leccionCtrl;
