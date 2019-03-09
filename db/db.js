const {MongoClient, ObjectID} = require('mongodb');
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
        const collection = await client.db(dbName).collection(collName);
        let todos = await collection.find().sort({order:-1}).toArray();
        newTodo.order = todos[0].order + 1;
        const insertedTodo = await collection.insertOne(newTodo);
        client.close();

        return insertedTodo.insertedId;
    },
    deleteTodo : async function({_id, order}) {
        let client = await MongoClient.connect(uri, {useNewUrlParser: true});
        const collection = await client.db(dbName).collection(collName);
        let {message} = await collection.deleteOne({_id: ObjectID.createFromHexString(_id)});
        collection.updateMany({order:{$gt: order}}, {$inc:{order: -1}});
        return message.documents;
    }
};

////////////////////////////////////

module.exports = { db };