var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var db = mongoose.connect(process.env.MONGODB_URL ||'mongodb://localhost/todo');

app.post('/task', function(req, res){
    var newTask = new Task(req.body);
    newTask.save(function (err, result) {
      if (err) return console.error(err);
        return res.send(result);
    });
});

app.get('/', function(req, res){
  return res.send('Welcome!');
});

app.get('/task/:id', function(req, res){     
  Task.findById(req.params.id, function(err, foundTask){
      return res.send(foundTask);
  });
});

app.get('/tasks', function(req, res){       
  Task.find({},function(err, data){
      return res.json(data);
  });
});

app.put('/task/:id', function(req, res){     
  console.log(req.body, req.params.id);
  Task.findById(req.params.id, function(err, foundTask){
    console.log(foundTask);
    foundTask.title = req.body.title;
    foundTask.description = req.body.description;
      foundTask.save(function(err, updatedTask){
          return res.send(updatedTask);
      });
  });
});

app.delete('/task/:id', function(req, res){
  console.log(req.params);
  Task.findByIdAndRemove(req.params.id, function(err, deletedTask){
      return res.send(deletedTask);
  });
});

var taskSchema = mongoose.Schema({
    title: String,
    description: String,
    date: String
});

var Task = mongoose.model('Task', taskSchema);

app.listen('8080', function(){
  console.log('Server started on port 8080!');
});
