const express = require('express');
const app = express();
const cors = require ('cors');
const mongoose = require('mongoose');

const apiRoutes = require('./src/modules/routes/routes');

app.use(cors());
app.use(express.json());
app.use("/", apiRoutes);

const url = 'mongodb+srv://Alexey:restart987@cluster0.nsbyf.mongodb.net/TestCostAccounting?retryWrites=true&w=majority';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(7777, () => {
  console.log('Example app listening on port 7777');
});