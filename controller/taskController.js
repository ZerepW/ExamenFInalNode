var basicAuth = require('basic-auth');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var tasks = require ('../models/tasks').tasks;
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const jsrsasign = require('jsrsasign');

//AGREGAR TASKS
exports.postAgregar = function(request,response){
  response.setHeader('Content-Type', 'application/json');
    if (request.body.text && request.body.done && request.body.date) {
        if(typeof(request.body.done) == "boolean" && typeof(request.body.text) == "string" && typeof(request.body.date) == "string"){
            if(tasks.length>0){
                var numero = (tasks[tasks.length-1].id);
            }
            else{
                numero = 0;
            }
            request.body.id = numero+1;
            request.body.createdAt = new Date();
            request.body.updatedAt = new Date();
            tasks.push(request.body);
            response.send('{"id:":'+request.body.id+'}');
        }else{
            response.status(400);
            response.send("Los parametros que enviaste no son del tipo correcto.");
        }
    }else{
        response.status(400);
        response.send("Los parametros que enviaste son incorrectos.");
    }
};
//MOSTRAR LOS TASKS
exports.mostrarTasks = function(request,response){
    response.setHeader('Content-Type', 'application/json');
    response.send(tasks);
};

//ELIMINAR LOS TASKS
exports.eliminarTasks = function(request,response){
    response.setHeader('Content-Type', 'application/json');
    for (var i = 0; i < tasks.length; i++){
      if (tasks[i].id == request.params.id){
        tasks.splice(i,1);
        response.send("Eliminado exitosamente");
      }
    }
    response.status(400);
    response.send("El Task no existe");
};
//OBTENER TOKEN
exports.getToken = function(request,response){

  var usernameJSON = request.body.username;
  var passwordJSON = request.body.password;
  
  response.setHeader('Content-Type', 'application/json');
  
  let header = {
    alg: "HS256",
    typ: "JWT"
  };
  //PAYLOAD
  let payload = { 
  };

  payload.username = usernameJSON;
  payload.password = passwordJSON;
  payload.iat = jsrsasign.jws.IntDate.get('now'); // Fecha de generacion
  payload.secretCode = 'p4ssw0d';

  let secret_phrase = passwordJSON;
  let jwt = jsrsasign.jws.JWS.sign("HS256", JSON.stringify(header), JSON.stringify(payload), secret_phrase);

  jwtJSON = {"token": jwt}
  response.send(jwtJSON);
};