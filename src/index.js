const express = require('express')
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose');
const route = require('./routes/route')
const app = express();

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://amanmahto:anuragf45@bloggingwebsite.t7a0mo0.mongodb.net/Blogging-Website?retryWrites=true&w=majority",{
      useNewUrlParser: true,
    })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
