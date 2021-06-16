
const Task = require('../../db/models/task/index');

module.exports.getAllTasks = ((req, res) => {
  if(!req.body){
    res.status(400).send('Данные не верны')
  } else {
    Task.find().then(result => {
      res.send(result);
    });
  }
});

module.exports.createNewTask = ((req, res) => {
  const task = new Task (req.body);
  task.save().then(result => {
    res.send(result)
  });
});

module.exports.changeTaskInfo = ((req, res) => {
  if(!req.body._id || req.body.text && req.body.isCheck){
    res.send('Данные не верны')
  } else {
    Task.updateOne({_id: req.body._id}, req.body).then(result => {
      Task.find().then(result => {
        res.send(result)
      });
    });
  }
});

module.exports.deleteTask = ((req, res) => {
  if(!req.body._id){
    res.send('Данные не верны')
  } else {
    Task.deleteOne({_id: req.query._id}).then(result => {
      res.send(result)
    });  
  }
});
