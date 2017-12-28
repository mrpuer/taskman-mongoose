const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017/taskman';


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/taskman', { useMongoClient: true });
const db = mongoose.connection;

const app = express();
const restAPI = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/pub`));

// роутим хтмл
restAPI.get('/', (req, res) => {
  res.sendFile('/pub/index.html');
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection open');
});

const usersSchema = mongoose.Schema({
  name: String,
  id: Number
});

const tasksSchema = mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  status: Boolean,
  user: Number
});

const Users = mongoose.model('users', usersSchema);
const Tasks = mongoose.model('tasks', tasksSchema);


// // подключение к бд
// const newDbConnection = (callback) => {
//   MongoClient.connect(mongoURL, (err, db) => {
//     if (err) {
//       console.log(`Cant connect to DB. Error: ${err}`);
//       res.send('Sorry. Cant connect to DB...');
//     } else {
//       const coll = db.collection('contacts');
//       callback(coll);
//     }
//   });
  
// };

// добавление контакта
restAPI.post('/api/contacts/', (req, res) => {
  Users.find().sort({$natural:-1}).limit(1).exec((err, users) => {
    const id = (users.length === 0) ? 1 : users[0].id + 1;
    const newUser = new Users({ id, name: req.body.name });
    newUser.save((err, newUser) => {
      if (err) {
        console.log(`Cant connect to DB. Error: ${err}`);
        res.send('Sorry. Cant connect to DB...');
      } else {
        res.send('ok');
      }
    });
  });
});

// добавление таска
restAPI.post('/api/tasks/', (req, res) => {
  Tasks.find().sort({$natural:-1}).limit(1).exec((err, tasks) => {
    if (err) console.log(err);
    const id = (tasks.length === 0) ? 1 : tasks[0].id + 1;
    const task = req.body.content;
    const newTask = new Tasks({ id,
                                name: task.name,
                                desc: task.desc,
                                status: task.status,
                                user: task.user
                              });
    newTask.save((err, newTask) => {
      if (err) {
        console.log(`Cant connect to DB. Error: ${err}`);
        res.send('Sorry. Cant connect to DB...');
      } else {
        res.send('ok');
      }
    });
  });
});

// список контактов
restAPI.get('/api/users/', (req, res) => {
  Users.find((err, doc) => {
    if (err) {
      console.log(err);
      res.send('Sorry. DB Error.');
    } else {
      res.send(doc);
    }
  });
});

// список тасков
restAPI.get('/api/tasks/', (req, res) => {
  Tasks.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: 'id',
        as: 'userInfo'
      }
    },
    {
      $project: { id: 1, name: 1, desc:1, status:1, userName: '$userInfo.name', userId: '$userInfo.id' }
    }
  ], (err, result) => {
    res.send(result);
  });
});

// удаление контакта
restAPI.delete('/api/users/:id', (req, res) => {
  Users.deleteOne({ id : `${req.params.id}` }, (err, result) => {
    if (err) {
      console.log(`Cant connect to DB. Error: ${err}`);
      res.send('Sorry. Cant connect to DB...');
    } else {
      res.send('ok');
    }
  });
});

// удаление таска
restAPI.delete('/api/tasks/:id', (req, res) => {
  Tasks.deleteOne({ id : `${req.params.id}` }, (err, result) => {
    if (err) {
      console.log(`Cant connect to DB. Error: ${err}`);
      res.send('Sorry. Cant connect to DB...');
    } else {
      res.send('ok');
    }
  });
});

// редактирование юзера
restAPI.put('/api/users/:id', (req, res) => {
  Users.updateOne({ id : `${req.body.id}` }, { name: req.body.name }, (err, result) => {
    if (err) {
      console.log(`Cant connect to DB. Error: ${err}`);
      res.send('Sorry. Cant connect to DB...');
    } else {
      res.send(result);
    }
  });
});

// редактирование таска
restAPI.put('/api/tasks/:id', (req, res) => {
  console.log(req.body);
  const data = { name: req.body.name,
                 desc: req.body.desc,
                 status: +req.body.status,
                 user: +req.body.user
                }
  Tasks.updateOne({ id : `${req.params.id}` }, data, (err, result) => {
    if (err) {
      console.log(`Cant connect to DB. Error: ${err}`);
      res.send('Sorry. Cant connect to DB...');
    } else {
      res.send('ok');
    }
  });
});

// //поиск
// restAPI.get('/api/search/', (req, res) => {
//   const searchData = {};
//   searchData[req.query.where] = req.query.what
//   newDbConnection((collection) => {
//     collection.find(searchData).toArray((err, docs) => {
//       if (err) {
//         console.log(`Cant connect to DB. Error: ${err}`);
//         res.send('Sorry. Cant connect to DB...');
//       } else {
//         res.send(docs);
//       }
//     });
//   });
// });

app.use('/', restAPI);
app.listen(3000, () => process.stdout.write('Server is running...\n'));
