const {MongoClient} = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'TodosAppDB';
const collName = 'Todos';

const db = {
    getTodos : async function() {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        const todos = await client.db(dbName).collection(collName).find().toArray();
        client.close();
        return todos;
    },
    addTodo : async function(newTodo) {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        
        if(!client) return Promise.reject("Can not connect to database right now, please try a few minutes later");
        
        const collection = await client.db(dbName).collection(collName);
        let docs = await collection.find().sort({order:-1}).toArray();
        newTodo.order = docs[0].order + 1;
        const insertedTodo = await collection.insertOne(newTodo);
        client.close();

        return Promise.resolve(insertedTodo.insertedId);
    }
};

////////////////////////////////////

module.exports = { db };