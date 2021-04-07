const express = require('express')
const app = express()
require('dotenv').config();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = 6100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8lukw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("trustShop").collection("books");
  const ordersCollection = client.db("trustShop").collection("orders");

 
 app.get('/books',(req, res)=>{
     bookCollection.find({})
     .toArray((err, documents)=>{
         res.send(documents)
     })
 })

 app.get('/books/:id',(req, res)=>{
    const id = req.params.id;
    
     bookCollection.find({_id: ObjectId(id)})
     .toArray((err, documents)=>{
        console.log(documents)
         res.send(documents)
     })
 })

 app.post('/addProduct',(req,res)=>{
     const product = req.body;
     bookCollection.insertOne(product)
     .then(result =>{
        console.log('data successfully')
        res.send('success')
     })
     
 })

 app.delete('/delete/:id',(req, res)=>{
    const id = req.params.id;
     bookCollection.deleteOne({_id: ObjectId(id)})
     .then((result)=>{
     })
 })


 app.post('/addOrders', (req, res)=>{
    const order = req.body;
    console.log(order)
    ordersCollection.insertOne(order)
    .then(result =>{
        console.log(result)
    })
})

app.get('/orderData', (req, res) => {
    const email = req.query.email;
    ordersCollection.find({email: email})
        .toArray((err, items) => {
            res.send(items)
        })
})
});


app.listen(port)