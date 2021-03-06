/* eslint-disable linebreak-style */
const express = require('express'); // web server
const chalk = require('chalk'); // coloring for console text
const debug = require('debug')('app'); // safer logging than using console - only runs in debug... (don't use console)
const morgan = require('morgan'); // http logging
const path = require('path'); // helps create valid path to html pages
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 4000;
const db = mongoose.connect('mongodb://localhost/nodeApi');
const Todo = require('./models/todoModel');

const todoRouter = express.Router();

todoRouter.get('/todos', (req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      return res.send(err);
    }
    return res.json(todos);
  });
});
app.use('/api', todoRouter);

app.use(morgan('combined')); // set morgan to 'tiny' to get much more succint logging
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery.easing')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    endpoints: [{
      url: 'http://localhost:3000/api/todos',
      displayName: 'Todo List',
    },
    {
      url: 'second endpoint',
      displayName: 'not defined yet',
    }],
    title: 'API test endpoint in node.js',
  });
});


app.listen(port, () => {
  debug(`listening on port: ${chalk.green(port)}`);
});
