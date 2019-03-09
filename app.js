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
        .catch((err)=>{console.log(err); res.json({})})
});

app.post('/todos', function(req, res){
    db.addTodo(req.body)
        .then((insertedId)=>{req.body._id = insertedId; res.json(req.body);})
        .catch(()=>res.json({}))
});

app.put('/todos', function(req, res) {
    console.log(req.body);
    res.json({});
})

app.delete('/todos', function(req, res){
    db.deleteTodo(req.body)
        .then((deletedTodo)=>res.json(deletedTodo))
        .catch((err)=>{console.log(err); res.json({})})
});

app.listen(3001, 'localhost');