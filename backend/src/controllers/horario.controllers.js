const horarioCtrl = {};
const Horario = require("../models/horario");
const RenovarHorario = require("../models/renovarHorario");
const Turno = require("../models/Turno");
const Empresa = require("../models/empresa");
const Clase = require("../models/clase");
const { granDemanda, granDemanda2 } = require("../libs/politicas");

horarioCtrl.getHorarios = async (req, res) => {
  const horarios = await Horario.find(); 
  res.json(horarios);
};

horarioCtrl.getEsquemaHorarios = async (req, res) => {
  const esqHorarios = await RenovarHorario.find(); 
  res.json(esqHorarios);
};

horarioCtrl.createHorario = async (req, res) => {
  const {
    horario,
    activo,
    regenerar,
    lugar,
    mostrarTodo,
    fechaInicio,
  } = req.body;
  const nuevoHorario = new Horario({
    horario,
    activo,
    regenerar,
    lugar,
    mostrarTodo,
    fechaInicio,
  });
+ //console.log(horario)
  console.log(activo)
+ console.log(nuevoHorario)
  const horarioGuardado = await nuevoHorario.save();
  console.log('horario guardado')
  console.log(horarioGuardado)
+ console.log(horarioGuardado._id)
  const estructuraHorario = new RenovarHorario({
    horario,
    activo,
    regenerar,
    lugar,
    fechaInicio,
    mostrarTodo,
    idHorario: horarioGuardado._id
  });
  const EstructuraHorarioGuardado = await estructuraHorario.save();
  console.log('estructura de horario guardada')
  console.log(EstructuraHorarioGuardado)

  res.json({ message: "nuevoHorario" });
};

horarioCtrl.getHorario = async (req, res) => {
  const horario = await Horario.findById(req.params.id);
  console.log(horario)
  res.json({ horario });
};


horarioCtrl.getEsquemaHorario = async (req, res) => {
  //const horario = await RenovarHorario.findById(req.params.id);
  const horario = await RenovarHorario.find({ idHorario: req.params.id });
  console.log(horario)
  res.json({ horario });
};

horarioCtrl.updateHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const {
    horario,
    activo,
    regenerar,
    lugar,
    mostrarTodo,
    fechaInicio,
  } = req.body;
  await Horario.findOneAndUpdate({ _id: req.params.id }, 
    { $set: {
    horario,
    activo,
    regenerar,
    lugar,
    mostrarTodo,
    fechaInicio,
    }
  });
  res.json({ message: "Horario actualizado" });
};

horarioCtrl.deleteHorario = async (req, res) => {
  const esquemaHorario = await RenovarHorario.find({ idHorario: req.params.id });
  await Horario.findByIdAndDelete(req.params.id);
  console.log("horario eliminado")
  
  if (esquemaHorario[0] != undefined){
    const idEsquema = esquemaHorario[0]._id
    const esqDel = await RenovarHorario.findByIdAndDelete(idEsquema);
  }
  res.json({ title: "horario eliminado" });
};

horarioCtrl.horariosActivos = async (req, res) => {
  const horarios = await Horario.find({ activo: true });
  console.log(horarios)
  res.json(horarios);
};

horarioCtrl.activarHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const { activo } = req.body;
  await Horario.findOneAndUpdate({ _id: req.params.id }, { $set: { activo } });
  console.log(activo)
  console.log("estado del Horario actualizado" )
  res.json({ message: "estado del Horario actualizado" });
};

horarioCtrl.MostrarTodoElHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const { mostrarTodo } = req.body;
  await Horario.findOneAndUpdate({ _id: req.params.id }, { $set: { mostrarTodo } });
  console.log(mostrarTodo)
  console.log("estado del Horario actualizado" )
  res.json({ message: "estado del Horario actualizado" });
};

horarioCtrl.tituloHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const { lugar } = req.body;
  await Horario.findOneAndUpdate({ _id: req.params.id }, { $set: { lugar } });
  console.log(lugar)
  console.log("el titulo del Horario ha sido actualizado" )
  res.json({ message: "el titulo del Horario ha sido actualizado" });
};

horarioCtrl.regenerarHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const { regenerar } = req.body;
  await Horario.findOneAndUpdate({ _id: req.params.id }, { $set: { regenerar } });
  console.log(regenerar)
  console.log("El Horario se regenerará periodicamente" )
  res.json({ message: "El Horario se regenerará periodicamente" });
};


horarioCtrl.solicitudHorario = async (req, res) => {
  console.log(req.params.id, req.body);
  const objHorario = await Horario.findById(req.params.id); 
  const empresa = await Empresa.find();
  const {
    dia,
    indice,
    autor1,
    socio1,
    codigo,
    autor2,
    socio2,
    autor3,
    socio3,
    autor4,
    socio4,
    horaSolicitud,
    solicita,
  } = req.body;
  
  if (solicita == "Turno"){
    
    console.log(solicita)
    console.log("solicita Turno")
    //Una persona no puede jugar 2 turnos seguidos ya sea como titular o invitado. Se puede programar solo por reposición.
    //politica de GranDemanda 
    if(objHorario.horario[indice].granDemanda == true){
      //const agendoElDiaAnterior = await granDemanda(req.params.id, objHorario, dia, indice, autor1) //version1 solo verifica autor1
      const agendoElDiaAnterior = await granDemanda2(req.params.id, objHorario, dia, indice, autor1, autor2, autor3, autor4) //verifica a todos los autores
      console.log(agendoElDiaAnterior)
      if(agendoElDiaAnterior == true){
        console.log("no se permite la solicitud por la politica de gran demanda")
        return res.status(400).json({ message: "debido a la politica de la gran demanda, no se puede agendar su solicitud de turno para el dia seleccionado" });
      }
    }
    const nuevoTurno = new Turno({
      titulo: "SOLICITUD DE TURNO",
      idHorario: req.params.id,
      dia,
      indice,
      solicita,
      autor1,
      socio1,
      codigo,
      autor2,
      socio2,
      autor3,
      socio3,
      autor4,
      socio4,
      horaSolicitud,
    });
    await nuevoTurno.save();
    
    console.log(empresa[0].aleatorio)
    if(empresa[0].aleatorio == true)
    {
      console.log('turno guardado, en el siguiente intervalo se hara el sorteo aleatorio para su asignacion')  
    } else {
      switch (dia){

        case  "domingo":
        objHorario.horario[indice].dia[6].solicita = solicita,
        objHorario.horario[indice].dia[6].autor1 = autor1,
        objHorario.horario[indice].dia[6].socio1 = socio1,
        objHorario.horario[indice].dia[6].codigo = codigo,
        objHorario.horario[indice].dia[6].autor2 = autor2,
        objHorario.horario[indice].dia[6].socio2 = socio2,
        objHorario.horario[indice].dia[6].autor3 = autor3,
        objHorario.horario[indice].dia[6].socio3 = socio3,
        objHorario.horario[indice].dia[6].autor4 = autor4,
        objHorario.horario[indice].dia[6].socio4 = socio4,
        objHorario.horario[indice].dia[6].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "lunes":
        objHorario.horario[indice].dia[0].solicita = solicita,
        objHorario.horario[indice].dia[0].autor1 = autor1,
        objHorario.horario[indice].dia[0].socio1 = socio1,
        objHorario.horario[indice].dia[0].codigo = codigo,
        objHorario.horario[indice].dia[0].autor2 = autor2,
        objHorario.horario[indice].dia[0].socio2 = socio2,
        objHorario.horario[indice].dia[0].autor3 = autor3,
        objHorario.horario[indice].dia[0].socio3 = socio3,
        objHorario.horario[indice].dia[0].autor4 = autor4,
        objHorario.horario[indice].dia[0].socio4 = socio4,
        objHorario.horario[indice].dia[0].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "martes":
        objHorario.horario[indice].dia[1].solicita = solicita,
        objHorario.horario[indice].dia[1].autor1 = autor1,
        objHorario.horario[indice].dia[1].socio1 = socio1,
        objHorario.horario[indice].dia[1].codigo = codigo,
        objHorario.horario[indice].dia[1].autor2 = autor2,
        objHorario.horario[indice].dia[1].socio2 = socio2,
        objHorario.horario[indice].dia[1].autor3 = autor3,
        objHorario.horario[indice].dia[1].socio3 = socio3,
        objHorario.horario[indice].dia[1].autor4 = autor4,
        objHorario.horario[indice].dia[1].socio4 = socio4,
        objHorario.horario[indice].dia[1].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "miercoles":
        objHorario.horario[indice].dia[2].solicita = solicita,
        objHorario.horario[indice].dia[2].autor1 = autor1,
        objHorario.horario[indice].dia[2].socio1 = socio1,
        objHorario.horario[indice].dia[2].codigo = codigo,
        objHorario.horario[indice].dia[2].autor2 = autor2,
        objHorario.horario[indice].dia[2].socio2 = socio2,
        objHorario.horario[indice].dia[2].autor3 = autor3,
        objHorario.horario[indice].dia[2].socio3 = socio3,
        objHorario.horario[indice].dia[2].autor4 = autor4,
        objHorario.horario[indice].dia[2].socio4 = socio4,
        objHorario.horario[indice].dia[2].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "jueves":
        objHorario.horario[indice].dia[3].solicita = solicita,
        objHorario.horario[indice].dia[3].autor1 = autor1,
        objHorario.horario[indice].dia[3].socio1 = socio1,
        objHorario.horario[indice].dia[3].codigo = codigo,
        objHorario.horario[indice].dia[3].autor2 = autor2,
        objHorario.horario[indice].dia[3].socio2 = socio2,
        objHorario.horario[indice].dia[3].autor3 = autor3,
        objHorario.horario[indice].dia[3].socio3 = socio3,
        objHorario.horario[indice].dia[3].autor4 = autor4,
        objHorario.horario[indice].dia[3].socio4 = socio4,
        objHorario.horario[indice].dia[3].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "viernes":
        objHorario.horario[indice].dia[4].solicita = solicita,
        objHorario.horario[indice].dia[4].autor1 = autor1,
        objHorario.horario[indice].dia[4].socio1 = socio1,
        objHorario.horario[indice].dia[4].codigo = codigo,
        objHorario.horario[indice].dia[4].autor2 = autor2,
        objHorario.horario[indice].dia[4].socio2 = socio2,
        objHorario.horario[indice].dia[4].autor3 = autor3,
        objHorario.horario[indice].dia[4].socio3 = socio3,
        objHorario.horario[indice].dia[4].autor4 = autor4,
        objHorario.horario[indice].dia[4].socio4 = socio4,
        objHorario.horario[indice].dia[4].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "sabado":
        objHorario.horario[indice].dia[5].solicita = solicita,
        objHorario.horario[indice].dia[5].autor1 = autor1,
        objHorario.horario[indice].dia[5].socio1 = socio1,
        objHorario.horario[indice].dia[5].codigo = codigo,
        objHorario.horario[indice].dia[5].autor2 = autor2,
        objHorario.horario[indice].dia[5].socio2 = socio2,
        objHorario.horario[indice].dia[5].autor3 = autor3,
        objHorario.horario[indice].dia[5].socio3 = socio3,
        objHorario.horario[indice].dia[5].autor4 = autor4,
        objHorario.horario[indice].dia[5].socio4 = socio4,
        objHorario.horario[indice].dia[5].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
      }
      try {
        await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
      } catch (error) {
        console.log(error)
        res.json(error.message);
      }
      //console.log(horario)
    }
  }
  if (solicita == "Clase"){
    console.log(solicita)
    console.log("solicita Clase")
    const nuevaClase = new Clase({
      titulo: "SOLICITUD DE CLASE",
      idHorario: req.params.id,
      dia,
      indice,
      solicita,
      autor1,
      socio1,
      codigo,
      horaSolicitud,
    });
    await nuevaClase.save();
    if(empresa[0].aleatorio == true)
    {
      console.log('clase guardada, en el siguiente intervalo se hara el sorteo aleatorio para su asignacion')
    } else {
      console.log(empresa[0].aleatorio)

      switch (dia){

        case  "domingo":
        objHorario.horario[indice].dia[6].solicita = solicita,
        objHorario.horario[indice].dia[6].autor1 = autor1,
        objHorario.horario[indice].dia[6].socio1 = socio1,
        objHorario.horario[indice].dia[6].codigo = codigo,
        objHorario.horario[indice].dia[6].autor2 = autor2,
        objHorario.horario[indice].dia[6].autor3 = autor3,
        objHorario.horario[indice].dia[6].autor4 = autor4,
        objHorario.horario[indice].dia[6].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "lunes":
        objHorario.horario[indice].dia[0].solicita = solicita,
        objHorario.horario[indice].dia[0].autor1 = autor1,
        objHorario.horario[indice].dia[0].socio1 = socio1,
        objHorario.horario[indice].dia[0].codigo = codigo,
        objHorario.horario[indice].dia[0].autor2 = autor2,
        objHorario.horario[indice].dia[0].autor3 = autor3,
        objHorario.horario[indice].dia[0].autor4 = autor4,
        objHorario.horario[indice].dia[0].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "martes":
        objHorario.horario[indice].dia[1].solicita = solicita,
        objHorario.horario[indice].dia[1].autor1 = autor1,
        objHorario.horario[indice].dia[1].socio1 = socio1,
        objHorario.horario[indice].dia[1].codigo = codigo,
        objHorario.horario[indice].dia[1].autor2 = autor2,
        objHorario.horario[indice].dia[1].autor3 = autor3,
        objHorario.horario[indice].dia[1].autor4 = autor4,
        objHorario.horario[indice].dia[1].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "miercoles":
        objHorario.horario[indice].dia[2].solicita = solicita,
        objHorario.horario[indice].dia[2].autor1 = autor1,
        objHorario.horario[indice].dia[2].socio1 = socio1,
        objHorario.horario[indice].dia[2].codigo = codigo,
        objHorario.horario[indice].dia[2].autor2 = autor2,
        objHorario.horario[indice].dia[2].autor3 = autor3,
        objHorario.horario[indice].dia[2].autor4 = autor4,
        objHorario.horario[indice].dia[2].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "jueves":
        objHorario.horario[indice].dia[3].solicita = solicita,
        objHorario.horario[indice].dia[3].autor1 = autor1,
        objHorario.horario[indice].dia[3].socio1 = socio1,
        objHorario.horario[indice].dia[3].codigo = codigo,
        objHorario.horario[indice].dia[3].autor2 = autor2,
        objHorario.horario[indice].dia[3].autor3 = autor3,
        objHorario.horario[indice].dia[3].autor4 = autor4,
        objHorario.horario[indice].dia[3].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "viernes":
        objHorario.horario[indice].dia[4].solicita = solicita,
        objHorario.horario[indice].dia[4].autor1 = autor1,
        objHorario.horario[indice].dia[4].socio1 = socio1,
        objHorario.horario[indice].dia[4].codigo = codigo,
        objHorario.horario[indice].dia[4].autor2 = autor2,
        objHorario.horario[indice].dia[4].autor3 = autor3,
        objHorario.horario[indice].dia[4].autor4 = autor4,
        objHorario.horario[indice].dia[4].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
        
        case  "sabado":
        objHorario.horario[indice].dia[5].solicita = solicita,
        objHorario.horario[indice].dia[5].autor1 = autor1,
        objHorario.horario[indice].dia[5].socio1 = socio1,
        objHorario.horario[indice].dia[5].codigo = codigo,
        objHorario.horario[indice].dia[5].autor2 = autor2,
        objHorario.horario[indice].dia[5].autor3 = autor3,
        objHorario.horario[indice].dia[5].autor4 = autor4,
        objHorario.horario[indice].dia[5].horaSolicitud = horaSolicitud,
        horario = objHorario.horario
        break;
      }
      try {
        await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
      } catch (error) {
        console.log(error)
        res.json(error.message);
      }
      //console.log(horario)
    }
  }
  if (solicita == "cancelar"){
    console.log(solicita)
    console.log("solicita cancelar")
    switch (dia){

      case  "domingo":
      objHorario.horario[indice].dia[6].solicita = null,
      objHorario.horario[indice].dia[6].autor1 = null,
      objHorario.horario[indice].dia[6].socio1 = null,
      objHorario.horario[indice].dia[6].codigo = null,
      objHorario.horario[indice].dia[6].autor2 = null,
      objHorario.horario[indice].dia[6].socio2 = null,
      objHorario.horario[indice].dia[6].autor3 = null,
      objHorario.horario[indice].dia[6].socio3 = null,
      objHorario.horario[indice].dia[6].autor4 = null,
      objHorario.horario[indice].dia[6].socio4 = null,
      objHorario.horario[indice].dia[6].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "lunes":
      objHorario.horario[indice].dia[0].solicita = null,
      objHorario.horario[indice].dia[0].autor1 = null,
      objHorario.horario[indice].dia[0].socio1 = null,
      objHorario.horario[indice].dia[0].codigo = null,
      objHorario.horario[indice].dia[0].autor2 = null,
      objHorario.horario[indice].dia[0].socio2 = null,
      objHorario.horario[indice].dia[0].autor3 = null,
      objHorario.horario[indice].dia[0].socio3 = null,
      objHorario.horario[indice].dia[0].autor4 = null,
      objHorario.horario[indice].dia[0].socio4 = null,
      objHorario.horario[indice].dia[0].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "martes":
      objHorario.horario[indice].dia[1].solicita = null,
      objHorario.horario[indice].dia[1].autor1 = null,
      objHorario.horario[indice].dia[1].socio1 = null,
      objHorario.horario[indice].dia[1].codigo = null,
      objHorario.horario[indice].dia[1].autor2 = null,
      objHorario.horario[indice].dia[1].socio2 = null,
      objHorario.horario[indice].dia[1].autor3 = null,
      objHorario.horario[indice].dia[1].socio3 = null,
      objHorario.horario[indice].dia[1].autor4 = null,
      objHorario.horario[indice].dia[1].socio4 = null,
      objHorario.horario[indice].dia[1].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "miercoles":
      objHorario.horario[indice].dia[2].solicita = null,
      objHorario.horario[indice].dia[2].autor1 = null,
      objHorario.horario[indice].dia[2].socio1 = null,
      objHorario.horario[indice].dia[2].codigo = null,
      objHorario.horario[indice].dia[2].autor2 = null,
      objHorario.horario[indice].dia[2].socio2 = null,
      objHorario.horario[indice].dia[2].autor3 = null,
      objHorario.horario[indice].dia[2].socio3 = null,
      objHorario.horario[indice].dia[2].autor4 = null,
      objHorario.horario[indice].dia[2].socio4 = null,
      objHorario.horario[indice].dia[2].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "jueves":
      objHorario.horario[indice].dia[3].solicita = null,
      objHorario.horario[indice].dia[3].autor1 = null,
      objHorario.horario[indice].dia[3].socio1 = null,
      objHorario.horario[indice].dia[3].codigo = null,
      objHorario.horario[indice].dia[3].autor2 = null,
      objHorario.horario[indice].dia[3].socio2 = null,
      objHorario.horario[indice].dia[3].autor3 = null,
      objHorario.horario[indice].dia[3].socio3 = null,
      objHorario.horario[indice].dia[3].autor4 = null,
      objHorario.horario[indice].dia[3].socio4 = null,
      objHorario.horario[indice].dia[3].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "viernes":
      objHorario.horario[indice].dia[4].solicita = null,
      objHorario.horario[indice].dia[4].autor1 = null,
      objHorario.horario[indice].dia[4].socio1 = null,
      objHorario.horario[indice].dia[4].codigo = null,
      objHorario.horario[indice].dia[4].autor2 = null,
      objHorario.horario[indice].dia[4].socio2 = null,
      objHorario.horario[indice].dia[4].autor3 = null,
      objHorario.horario[indice].dia[4].socio3 = null,
      objHorario.horario[indice].dia[4].autor4 = null,
      objHorario.horario[indice].dia[4].socio4 = null,
      objHorario.horario[indice].dia[4].horaSolicitud = null,
      horario = objHorario.horario
      break;
      
      case  "sabado":
      objHorario.horario[indice].dia[5].solicita = null,
      objHorario.horario[indice].dia[5].autor1 = null,
      objHorario.horario[indice].dia[5].socio1 = null,
      objHorario.horario[indice].dia[5].codigo = null,
      objHorario.horario[indice].dia[5].autor2 = null,
      objHorario.horario[indice].dia[5].socio2 = null,
      objHorario.horario[indice].dia[5].autor3 = null,
      objHorario.horario[indice].dia[5].socio3 = null,
      objHorario.horario[indice].dia[5].autor4 = null,
      objHorario.horario[indice].dia[5].socio4 = null,
      objHorario.horario[indice].dia[5].horaSolicitud = null,
      horario = objHorario.horario
      break;
    }
    try {
      await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
    } catch (error) {
      console.log(error)
      res.json(error.message);
    }
    //console.log(horario)
  }
  res.json({message: true });
};



horarioCtrl.editarAsistio = async (req, res) => {
  console.log(req.params.id, req.body);
  const objHorario = await Horario.findById(req.params.id); 
  const {
    dia,
    indice,
    asistio
  } = req.body;

  switch (dia){
    case  "domingo":
    objHorario.horario[indice].dia[6].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "lunes":
      objHorario.horario[indice].dia[0].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "martes":
      objHorario.horario[indice].dia[1].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "miercoles":
      objHorario.horario[indice].dia[2].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "jueves":
      objHorario.horario[indice].dia[3].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "viernes":
      objHorario.horario[indice].dia[4].asistio = asistio,
    horario = objHorario.horario
    break;
    
    case  "sabado":
      objHorario.horario[indice].dia[5].asistio = asistio,
    horario = objHorario.horario
    break;
  }
  try {
    await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
  } catch (error) {
    console.log(error)
    res.json(error.message);
  }

  res.json({ horario });
};

horarioCtrl.asignarProfesor = async (req, res) => {
  console.log(req.params.id, req.body);
  const objHorario = await Horario.findById(req.params.id); 
  const {
    dia,
    indice,
    profesor,
    canchero,
    idProfesor,
    idCanchero,
    colorProfesor
  } = req.body;

  switch (dia){
    case  "domingo":
    objHorario.horario[indice].dia[6].profesor = profesor,
    objHorario.horario[indice].dia[6].canchero = canchero,
    objHorario.horario[indice].dia[6].idProfesor = idProfesor,
    objHorario.horario[indice].dia[6].idCanchero = idCanchero,
    objHorario.horario[indice].dia[6].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "lunes":
    objHorario.horario[indice].dia[0].profesor = profesor,
    objHorario.horario[indice].dia[0].canchero = canchero,
    objHorario.horario[indice].dia[0].idProfesor = idProfesor,
    objHorario.horario[indice].dia[0].idCanchero = idCanchero,
    objHorario.horario[indice].dia[0].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "martes":
    objHorario.horario[indice].dia[1].profesor = profesor,
    objHorario.horario[indice].dia[1].canchero = canchero,
    objHorario.horario[indice].dia[1].idProfesor = idProfesor,
    objHorario.horario[indice].dia[1].idCanchero = idCanchero,
    objHorario.horario[indice].dia[1].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "miercoles":
    objHorario.horario[indice].dia[2].profesor = profesor,
    objHorario.horario[indice].dia[2].canchero = canchero,
    objHorario.horario[indice].dia[2].idProfesor = idProfesor,
    objHorario.horario[indice].dia[2].idCanchero = idCanchero,
    objHorario.horario[indice].dia[2].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "jueves":
    objHorario.horario[indice].dia[3].profesor = profesor,
    objHorario.horario[indice].dia[3].canchero = canchero,
    objHorario.horario[indice].dia[3].idProfesor = idProfesor,
    objHorario.horario[indice].dia[3].idCanchero = idCanchero,
    objHorario.horario[indice].dia[3].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "viernes":
    objHorario.horario[indice].dia[4].profesor = profesor,
    objHorario.horario[indice].dia[4].canchero = canchero,
    objHorario.horario[indice].dia[4].idProfesor = idProfesor,
    objHorario.horario[indice].dia[4].idCanchero = idCanchero,
    objHorario.horario[indice].dia[4].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
    
    case  "sabado":
    objHorario.horario[indice].dia[5].profesor = profesor,
    objHorario.horario[indice].dia[5].canchero = canchero,
    objHorario.horario[indice].dia[5].idProfesor = idProfesor,
    objHorario.horario[indice].dia[5].idCanchero = idCanchero,
    objHorario.horario[indice].dia[5].colorProfesor = colorProfesor,
    horario = objHorario.horario
    break;
  }   
    try {
      await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
    } catch (error) {
      console.log(error)
      res.json(error.message);
    }

  res.json({ horario });
};



horarioCtrl.editarGranDemanda = async (req, res) => {
  console.log(req.params.id, req.body);
  const objHorario = await Horario.findById(req.params.id); 
  const {
    indice,
    granDemanda
  } = req.body;
  objHorario.horario[indice].granDemanda = granDemanda
  horario = objHorario.horario
  await Horario.findOneAndUpdate({ _id: req.params.id }, { horario });
  res.json({ message: "Horario actualizado" });
};
module.exports = horarioCtrl;
