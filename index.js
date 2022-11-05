require("dotenv").config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// midlesware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Genius car Server is runnning")
})

// mongopass
// pass:PTlfb1EatHX9C4gk
// username:geniusCarDBuser


// const uri = `mongodb+srv://${process.env.DB_CARUSER}:${process.env.DB_PASSWORD}@cluster0.qdaz7cw.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_CARUSER}:${process.env.DB_PASSWORD}@cluster0.qdaz7cw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 function verifyJWT (req, res, next) {
    const authHeader= req.headers.authorization;
    if(!authHeader){
       return res.status(401).send({message : "unauthorized access"})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: "unauthorized access"})
        }
        req.decoded = decoded;
        next()
    })
}
async function run() {
    try {
        const serviceCollection = client.db("geniusCar").collection("services");
        const orderCollection = client.db('geniusCar').collection("orders");

        app.post('/jwt',  (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"})
           res.send({token})
        })


        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            console.log(services)
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        // Ordera Api
        app.get('/orders', verifyJWT,  async (req, res) => {
           const decoded = req.decoded;
           console.log("inside orders api", decoded);
           if(decoded.email !== req.query.email){
            req.status(403).send({message: "unauthorized access"})
           }
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        });
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
    }
    finally {

    }

}

run().catch(err => console.err(err));



app.listen(port, () => {
    console.log(`Genius Car sever running on ${port}`)
})