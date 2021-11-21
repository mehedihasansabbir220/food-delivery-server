const express = require('express');
const bodyParsee = require("body-parser");
const cors = require("cors");
require("dotenv").config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const { ObjectID } = require('bson');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncqfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('hello world')
})

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('foodShop').collection('products');
        const orderCollection = client.db('foodShop').collection('orders');
        //Add Product 
        app.post('/addProducts', async (req, res) => {
            const doc = req.body
            const result = await productCollection.insertOne(doc)
            res.json(result)
            console.log(result);
        });
        //Find All Product
        app.get("/products", async (req, res) => {
            const result = await productCollection.find({}).toArray()
            res.send(result)
        })
        //Delet Product
        app.delete('/deletProduct/:id', async (req, res) => {

            const Id = req.params.id
            const query = { _id: ObjectID(Id) }
            // console.log(query);
            const result = await productCollection.deleteOne(query)
            // console.log(result)
            res.send(result)
        });
        //Get Sinsle Product
        app.get('/singleProduct/:id', async (req, res) => {
            // console.log(req.params.id);
            const Id = req.params.id
            const query = { _id: ObjectID(Id) }
            const result = await productCollection.findOne(query)
            res.send(result)
            // console.log(result)
        })
        //Update a Data 
        app.put('/update/:id', async (req, res) => {
            // console.log('data is currect')
            const Id = req.params.id
            const updateInfo = req.body;
            const query = { _id: ObjectID(Id) }
            // console.log(updateInfo)
            const updateDoc = {
                $set: {
                    name: updateInfo.name,
                    descriptioname: updateInfo.descriptioname,
                    image: updateInfo.image,
                    price: updateInfo.price
                },
            };
            const result = await productCollection.updateOne(query, updateDoc)
            // console.log(result)
            res.send(result)
        })
        //Add Order
        app.post('/addOrder', async (req, res) => {
            // console.log('hitting the Order ');
            const doc = req.body
            const result = await orderCollection.insertOne(doc)
            console.log(result)
            res.send(result)
        }
        )

        //My  Orders
        app.get("/myOrders/:email", async (req, res) => {
            // console.log('hitting the data');
            // console.log(req.params.email);
            const email = req.params.email
            const query = { email: email }
            // console.log(query)
            const result = await orderCollection.find(query).toArray()
            // console.log(result)
            res.send(result)
        })
        //delete Order
        app.delete('/buyNow/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: id }
            // console.log(query)
            const result = await orderCollection.deleteOne(query)
            // console.log(result);
            res.send(result)
        })
        //All Orders
        app.get('/allOrders', async (req, res) => {

            const result = await orderCollection.find({}).toArray()
            // console.log(result);
            res.send(result)

        })

        //All Orders Delete
        app.delete('/AllOrderDelete/:id', async (req, res) => {
            const Id = req.params.id
            // console.log(Id);
            const query = { _id: Id }
            // console.log(query);
            const result = await orderCollection.deleteOne(query)
            // console.log(result);
            res.send(result)
        })
        //After Buy Now Delete Order
        app.delete('/placeOrder/:id', async (req, res) => {
            const Id = req.params.id
            const query = { _id: Id }
            // console.log(query);
            const result = await orderCollection.deleteOne(query)
            // console.log(result);
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log('Running this Port', port);
})