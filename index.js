require('dotenv').config();
const { PORT, PUBLIC_PATH, INDEX_FILE } = process.env;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });
const db = low(new FileSync('db.json'));
if(!db.get('users').value())
    setDefaultUser(db);

const app = express();
app.use(express.static(`${__dirname}/${PUBLIC_PATH}`));

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['authorized', 'login'],
}));

const api = require('./routes');
app.use('/', api);
app.use(morgan('tiny'));

app.get('*', function (_, res) {
    res.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, INDEX_FILE));
});

app.listen(PORT, () => console.log(`Server started at ${PORT}`));


function setDefaultUser(database){
    database.defaults({
        users: [
          { name: "demo", email: "demo@demo", password: "demo", id: "1" }
        ],
        accounts: [
         
        ],
        transactions: [
           
        ]
      }).write()
}
