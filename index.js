const express = require('express');
const bodyParser = require('body-parser');
const password = "jjs12345"


const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://organicUser:jjs12345@cluster0.hdbqd.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app = express();
app.use(bodyParser.json());
// Form submit এর জন্য
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send("Hello Guys I'm working")
    res.sendFile(__dirname + "/index.html")
});



client.connect(err => {
  const collection = client.db("organicdb").collection("products");
  
  app.get("/products", (req, res) => {
    collection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.get("/product/:id", (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })
  
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result =>{
      console.log("Data added successfully")
      res.redirect("/")
      // res.send("successfully done")
    })
  })

  app.delete("/delete/:id", (req, res) =>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      // console.log(result);
      res.send(result.deletedCount > 0)
    })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price);
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      console.log(result);
      res.send(result.modifiedCount > 0);
    })
  })
  
  // const products = {
  //   Name: "Modhu",
  //   Price: 100,
  //   quantity: 220
  // }
  // collection.insertOne(products)
  // .then((result) => console.log("products added"))
  console.log("database connected")
  // perform actions on the collection object
  // client.close();
});


app.listen(3000);