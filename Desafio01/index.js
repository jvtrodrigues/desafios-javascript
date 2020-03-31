const express = require('express'); // importa o express para a variável

const server = express(); //variável server recebe as funções de express

server.use(express.json()); // permite server usar json para comunicar

const projects = []; // recebe array

let counter = 0;

server.use((req, res, next) => {
  counter++;
  console.log(`Requests: ${counter}`);
  next();
});

function checkIfIdWasInformedBody(req, res, next){
  if(!req.body.id){
    return res.status(400).json({error: 'Id must to be informed'});
  }

  next();
}

function checkIfIdExists(req, res, next){
  const project = projects.find(p => p.id == req.params.id);
  if(!project) {
    return res.status(400).json({error: 'Project does not exists'});
  }

  next();
}

//POST: criar/enviar 
server.post('/projects', checkIfIdWasInformedBody, (req, res) => {
  const {id, title} =  req.body; // pega informações do corpo
  const project = {
    id: id,
    title: title,
    tasks: []
  }
  projects.push(project); // adiciona um objeto no array de projetos
  return res.json(project);
});

// GET: buscar/listar
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// PUT: alterar, Query params ?parametro=valor
server.put('/projects/:id', checkIfIdExists, (req, res) => {
  const {title} = req.body;
  const project = projects.find(p => p.id == req.params.id);
  project.title = title;
  return res.json(projects);
});

// DELETE: remover
server.delete('/projects/:id', checkIfIdExists, (req, res) => {
  const projectIndex = projects.findIndex(p => p.id == req.params.id);
  projects.splice(projectIndex, 1);
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIfIdExists, (req, res) => {
  const {title} = req.body;
  const project = projects.find(p => p.id == req.params.id);
  project.tasks.push(title);
  return res.json(projects);
});

server.listen(3333);