const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ysesw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
    try{
        await client.connect();
        const bookCollection = client.db('boiGhor').collection('books');
        const addBookCollection = client.db('boiGhor').collection('newbooks');

        //all data get
        app.get('/books', async(req,res) =>{
            const query = {};
            const cursor = bookCollection.find(query);
            const allbooks = await cursor.toArray();
            res.send(allbooks);
        });
        //delete

        app.delete('/books/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })

        //add book
        app.post('/newbook', async (req, res) => {
          const NewBook = req.body;
          const result = await addBookCollection.insertOne(NewBook);
          res.send(result);
      })

      // show book
      app.get('/newbook', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const cursor = addBookCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
    })
    }
    finally{

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Running server");
});

app.listen(port, () => {
  console.log("Listen to port", port);
});
