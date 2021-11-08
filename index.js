const express = require('express');
const app = express();
const port = 5000;
const objectId =require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());


console.log(process.env.DB_USER);


const uri = "mongodb+srv://j:j@cluster0.vz7f0.mongodb.net/todo?retryWrites=true&w=majority";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vz7f0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allTodo = client.db("todo").collection("todoList");
  // perform actions on the collection object
  console.log("database connected");

  app.post('/addTodo',(req, res)=>{
    const newTodo = req.body;
  
    console.log('adding new product',newTodo);
    allTodo.insertOne(newTodo)
    .then(result => {
      console.log('in',result.insertedCount);
      res.send(result.insertedCount > 0 )
    })
})

app.get('/allTodo', (req,res)=>{

    allTodo.find()
    .toArray((err,todo) => {
      res.send(todo);
      
    })
  })

  app.delete('/deleteTodo/:id', (req, res) => {
    const id = objectId(req.params.id);
    console.log('delete this',id);
    allTodo.findOneAndDelete({_id: id})
    .then(documents => {res.send(documents)})
   .catch(err =>console.log(err))
   }) 
//   client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);