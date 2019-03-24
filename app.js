const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {db} = require('./db/db');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  

app.get('/todos', function(req, res){
    db.getTodos()
        .then((docs)=>res.json(docs))
        .catch(()=>res.json({}))
});

app.post('/todos', function(req, res){
    db.addTodo(req.body)
        .then((insertedId)=>{req.body._id = insertedId; res.json(req.body);})
        .catch(()=>res.json({}))
});

app.put('/todos', function(req, res) {
    db.updateTodoTitle(req.body)
        .then((feedback)=>res.json(feedback))
        .catch(()=>res.json({}))
});
    
app.put('/todos/update', function(req, res) {
    db.updateTodos(req.body.updateTodos)
        .then((feedback)=>res.json(feedback))
        .catch(()=>res.json({}))
});

app.delete('/todos', function(req, res){
    db.deleteTodo(req.body)
        .then((feedback)=>res.json(feedback))
        .catch(()=>res.json({}))
});

app.listen(3001, 'localhost');