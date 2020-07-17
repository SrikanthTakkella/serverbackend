const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://takkella:RMWn09pR3eLpVdZl@mongodb-r8p14.mongodb.net/<authentication>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(async(err) => {
    if(err) return console.log("errored out",err);
    const db = client.db("authentication");

  const collection = client.db("authentication").collection("testcollection");
  //await collection.insertOne({Name:"testname",Password:"Testpass"});
  const items = await db.collection("testcollection").find({}).toArray();
  console.log(items);
  // perform actions on the collection object
  client.close();
});