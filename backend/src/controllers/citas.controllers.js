const citasCtrl = {};

const Cita = require("../models/Cita");

citasCtrl.getCitas = async (req, res) => {
  const citas = await Cita.find(); //
  res.json(citas);
};
citasCtrl.createCita = async (req, res) => {
  const { title, content, author } = req.body;
  const nuevaCita = new Cita({
    title,
    content,
    //number,
    //date,
    author,
  });
  await nuevaCita.save();
  console.log(nuevaCita);
  //res.json({message:nuevaCita});
  res.json({ message: "cita guardada" });
};

citasCtrl.getCita = async (req, res) => {
  const cita = await Cita.findById(req.params.id);
  res.json({ message: cita });
};
citasCtrl.updateCita = async (req, res) => {
  console.log(req.params.id, req.body);
  const { title, content, author } = req.body;
  await Cita.findOneAndUpdate(req.params.id, {
    title,
    author,
    content,
  });
  res.json({ message: "cita actualizado" });
};

citasCtrl.deleteCita = async (req, res) => {
  const cita = await Cita.findByIdAndDelete(req.params.id);
  res.json({ title: "Cita eliminada" });
};

module.exports = citasCtrl;
