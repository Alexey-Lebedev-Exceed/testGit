import express from 'express';
import { Schema as _Schema, connect, model } from 'mongoose';
const app = express();
const Schema = _Schema;

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
});

const url = 'mongodb+srv://Alexey:restart987@cluster0.nsbyf.mongodb.net/TestEducationBD?retryWrites=true&w=majority'
connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const Task = model('tasks', taskScheme);

app.get('/', (req, res) => {
  const task = new Task({
    text: 'First task',
    isCheck: false
  });
  task.save().then(result => {
    res.send(result);
  }).catch(err => console.log(err))
});

app.get('/paramRequest', (req, res) => {
  Task.find().then(result => {
    res.send({data:result});
  });
});

app.listen(8800, () => {
  console.log('Example app listening on port 8800');
});