const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();


// midlesware
app.use(cors);
app.use(express.json());

app.get('/', (req, res) =>{
  res.send("Genius car Server is runnning")
})

// mongopass
// pass:PTlfb1EatHX9C4gk
// username:geniusCarDBuser


const uri = `mongodb+srv://${process.env.DB_CARUSER}:${process.env.DB_PASSWORD}@cluster0.qdaz7cw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.listen(port, () => {
    console.log(`Genius Car sever running on ${port}`)
})