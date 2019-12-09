const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  title: String,
  price: Number,
  amount: Number,
  total: Number,
});

const Item = mongoose.model('Item', itemSchema);

app.post('/api/items', async (req, res) => {
  console.log(req.body);
  const item = new Item({
    title: req.body.title,
    price: req.body.price,
    amount: req.body.amount,
    total: req.body.total
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.delete('/api/items/:id', async (req, res) => {
  var id = req.params.id;
  Item.deleteOne({_id: id }, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
    
});


app.listen(3000, () => console.log('Server listening on port 3000!'));