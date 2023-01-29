const ClaseCtrl = {};

const Clase = require("../models/clase");

ClaseCtrl.getClases = async (req, res) => {
  const clase = await Clase.find(); //
  res.json(clase);
};
ClaseCtrl.createClase = async (req, res) => {
  const {
    titulo,
    autor1,
    socio1,
    codigo,
    idHorario,
    dia,
    indice,
    solicita,
    horaSolicitud,
  } = req.body;
  const nuevaClase = new Clase({
    titulo,
    autor1,
    socio1,
    codigo,
    idHorario,
    dia,
    indice,
    solicita,
    horaSolicitud,
  });
  await nuevaClase.save();
  console.log(nuevaClase);
  res.json({ message: "clase guardada" });
};

ClaseCtrl.getClase = async (req, res) => {
  const clase = await nuevaClase.findById(req.params.id);
  res.json({ message: clase });
};
ClaseCtrl.updateClase = async (req, res) => {
  console.log(req.params.id, req.body);
  const {
    titulo,
    autor1,
    socio1,
    codigo,
    idHorario,
    dia,
    indice,
    solicita,
    horaSolicitud,
  } = req.body;
  await Clase.findOneAndUpdate({ _id: req.params.id }, {
    titulo,
    autor1,
    socio1,
    codigo,
    idHorario,
    dia,
    indice,
    solicita,
    horaSolicitud,
  });
  res.json({ message: "clase actualizado" });
};

ClaseCtrl.deleteClase = async (req, res) => {
  const clase = await Clase.findByIdAndDelete(req.params.id);
  res.json({ title: "Clase eliminada" });
};

module.exports = ClaseCtrl;
