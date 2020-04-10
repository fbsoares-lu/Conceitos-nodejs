const express = require("express");
const cors = require("cors");

const { uuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs} = request.body;

  const project = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(project);
  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const {title, url, techs} = request.body;
  const repositoryId = repositories.findIndex(
    project => project.id == id
  );

  if(repositoryId < 0){
    return response.status(400).json({error: "Repository not found"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryId].likes,
  }
  repositories[repositoryId] = repository
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id == id);

  if(repositoryId >= 0){
    repositories.splice(repositoryId, 1);
  } else {
    return response.status(400).json({error: 'Repository does not existis'} );
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id);
  
  if(!repository){
    return response.status(400).send();
  }

  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
