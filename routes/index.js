var express = require('express');
var router = express.Router();

const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://martoo:azpass@cluster0.akv9o8h.mongodb.net/?retryWrites=true&w=majority";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function createListing(client, newListing, collection) {
  const result = await client
    .db("Zabavnqchka")
    .collection(collection)
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

async function createAccount(name) {
  var client = new MongoClient(url);

  await client.connect();

  await createListing(
    client,
    {
      name: name,
      score: 0,
    },
    "Teachers"
  );

  await client.close();
}

router.post("/registerlektor", (req, res) => {
  let name = req.body.name;
  createAccount(name);
  res.send();
});

router.post("/leadbord", async (req, res) => {
  var client = new MongoClient(url);

  await client.connect();

  const teachers = await client
    .db("Zabavnqchka")
    .collection("Teachers")
    .find()
    .sort({ score: -1 })
    .toArray();

  await client.close();

  res.send({teachers:teachers});

});

router.post("/vote", async (req, res) => {
  let name = req.body.name;
  var client = new MongoClient(url);
  await client.connect();
  const result = await client
    .db("Zabavnqchka")
    .collection("Teachers")
    .updateOne(
      { name: name },
      { $inc: { score: 1 }}
    );
  await client.close();
  res.send();
});

module.exports = router;
