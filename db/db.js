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
        const todos = await collection.find().sort({order:-1}).toArray();
        if(todos.length !== 0)
            newTodo.order = todos[0].order + 1;
        else
            newTodo.order = 1;
        const insertedTodo = await collection.insertOne(newTodo);
        client.close();

        return insertedTodo.insertedId;
    },
    updateTodoTitle: async function({todoId, title}) {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        const collection = await client.db(dbName).collection(collName);
        let {message} = await collection.updateOne({_id: ObjectID(todoId)}, {$set:{title}});
        client.close();
        return message.documents;
    },
    updateTodos: async function(todos) {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        let session = await client.startSession({ readPreference: { mode: "primary" } });
        
        session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
        const collection = await client.db(dbName).collection(collName);

        try{
            for (const todo of todos) {
                collection.updateOne({_id: ObjectID(todo._id)}, {$set:{ order: todo.order, completed: todo.completed }})
            }
        }
        catch(err){
            session.abortTransaction();
            throw err;
        }

        session.commitTransaction();

        session.endSession();

        client.close();
        return 1;
    },
    deleteTodo : async function({_id, order, updateTodos}) {
        const client = await MongoClient.connect(uri, {useNewUrlParser: true});
        let session = await client.startSession({ readPreference: { mode: "primary" } });

        session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
        const collection = await client.db(dbName).collection(collName);

        let response;

        try{
            this.updateTodos(updateTodos);
            response = await collection.deleteOne({_id: ObjectID.createFromHexString(_id)});
            collection.updateMany({order:{$gt: order}}, {$inc:{order: -1}});
        }
        catch(err){
            session.abortTransaction();
            throw err;
        }

        session.commitTransaction();
        session.endSession();
        client.close();

        return response.message.documents;
    }
};

////////////////////////////////////

module.exports = { db };