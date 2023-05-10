const mysql = require('mysql2');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const { getVMdata } = require('./database.js')


const connection = mysql.createConnection({
    host: 'containers-us-west-48.railway.app',
    user: 'root',
    password: 'yRnj9VFzP4FZQNwhKogj',
    database: 'railway',
    port: 6921
});

const app = express();

app.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: false
}))

let a_email;
app.use(cors());
//app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("You've found me");
})

// FOR ADDING USER TO THE DATABASE (THATS IT NOTHING MORE TO IT)

app.post('/api/addUser', (req, res) => {
  const { fname, lname, email, password } = req.body;
  const query = `INSERT INTO user_data (fname, lname, email, passwd) VALUES (?, ?, ?, ?)`;
  const values = [fname, lname, email, password];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error adding user to database');
    } else {
      console.log('User added to database successfully!');
      res.status(200).send('User added to database successfully!');
    }
  });
});

// FOR ADDING VM INFO TO THE DATABASE (HOSTNAME, PORT AND STUFF....) 

app.post('/api/addVM', (req, res) => {
  const { hostname, port, username, passwd, memory, cpu, processor } = req.body;
  const query = `INSERT INTO vm_data (email, hostname, port_no, username, passwd, ram_memory, cores_cpu, processor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [a_email, hostname, port, username, passwd, memory, cpu, processor];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error adding user to database');
    } else {
      console.log('User added to database successfully!');
    }
  });
});

// Updating Port Number 

app.post('/api/updatePort', (req, res) => {
  const { hostname, port } = req.body;
  const query = `UPDATE vm_data set port_no=${port}, hostname='${hostname}' WHERE email='${a_email}'`;

  connection.query(query, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error updating the port');
    } else {
      console.log('Port and Hostname updated successfully');
    }
  });
});

// Deleting VM entry 

app.post('/api/deleteVM', (req, res) => {
  const { username, passwd } = req.body;
  const query = `delete from vm_data where email='${a_email}'`;

  connection.query(query, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error updating the port');
    } else {
      console.log('Deletion successfully');
    }
  });
});

// FOR USER LOGIN...

app.post('/api/login', (req, res) => {
  const { email, passwd } = req.body;
  const query = `SELECT * FROM user_data WHERE email = ? AND passwd = ?`;
  const values = [email, passwd];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving user data from database');
    } else {
      if (results.length === 0) {
          res.status(401).send('Invalid login credentials');
      } else {
          let session_data = req.session;
          session_data.token = email;
          a_email = session_data.token;
          console.log(session_data.token)
      }
    }
  });
});


// FOR FETCHING VM DATA AND SENDING...

app.get("/getVMdata", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    getVMdata((error, jsonData) => {
        if (error) {
            res.status(500).send('Error fetching data from database');
        } else {
            res.send(jsonData);
        }
    });
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
