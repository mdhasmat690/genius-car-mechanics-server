const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.az9qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting special ", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    //delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const quey = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(quey);
      res.json(result);
    });
  } finally {
    // await client.close;
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running  genius server");
});

app.get('/hello',(req,res)=>{
  res.send('hello updated hare')
})

app.listen(port, () => {
  console.log("running genius server on port", port);
});

/* 
one time
1. account open
2.heroku software install 
every project
1.git init
2.gitignore
3.push everything to git
4. make sure you have this script: "start": "node index.js"
5.make sure: put process.env.PORT in front of your port number
6.heroku login
7. heroku create(only one time)
8. git push heroku main
-----------
Update
1.git add, git commit, git push

*/