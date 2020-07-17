const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connection URL
const url = 'mongodb+srv://takkella:RMWn09pR3eLpVdZl@mongodb-r8p14.mongodb.net/test?retryWrites=true&w=majority';

// // Database Name
// const dbName = 'authentication';

const app = express();
const port = 3000;

const Message = mongoose.model('Message', {
  User: String,
  Message: String
});

const User = mongoose.model('User', {
  Name: String,
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to MongoDB");
});

app.use(bodyparser.json());
app.use(cors());



app.post('/api/message', async (req, res) => {
  console.log(req.body);
  const message = new Message(req.body);
  console.log(message);
  message.save();

  var user = await User.findOne({ Name: message.User });

  if (!user) {
    user = new User({ Name: message.User });
  }

  user.messages.push(message);
  user.save();

  res.status(200).send();
})

app.get('/api/message', async (req, res) => {
  const items = await Message.find();

  if (!items) return res.json({ err: 'no documents to retrieve' });

  res.json(items);

})

app.get('/api/user/:Name', async (req, res) => {
  const Name = req.params.Name;

  const aggregate = await User.aggregate([
    { $match : { Name } },

    { 
      $project:
      { 
        messages:1,Name: 1, isGold:  
        { 
          
          $gte: [{$size:"$messages"}, 5] 
      
        }
      } 
      
    }
   

  ])
  await User.populate(aggregate,{path:'messages'});

  res.json(aggregate);

  //return res.json(await User.findOne({Name}).populate('messages')) ;
})

mongoose.connect(url, { useNewUrlParser: true });


app.listen(port, () => console.log("App listening on Port", port));