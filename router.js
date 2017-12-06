
var basicAuth = require('basic-auth');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



const tasksController = require('./controller/taskController.js');
var tasks = require ('./models/tasks').tasks;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const jsrsasign = require('jsrsasign');

app.post('/api/tasks', tasksController.postAgregar);
app.get('/api/tasks', tasksController.mostrarTasks);
app.delete('/api/tasks/:id', tasksController.eliminarTasks);
app.post('/api/auth/token', tasksController.getToken);


exports.app = app;