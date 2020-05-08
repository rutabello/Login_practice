const express = require ('express');
const connection = require('./conf');
const app = express()
const bodyParser = require('body-parser');
const port = 5000;
const cors = require ('cors');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(session({
    secret: 'keyboard cat'
}))

// check DB connection working
connection.connect(function (err) {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  }
  console.log('connected as id ' + connection.threadId);
});


app.get('/', (req, res) => {
  res.send('it worksss!')
})

// Lets you read all the users in the user table
app.get('/user', (req, res) => {
  // console.log('rep el getttttttttt', req.body);

  connection.query('SELECT * FROM user', (err, results) => {
    if(err) {
      // console.log('error al get', err)
      res.status(500).send('error fetching posts')
    } else {
      // console.log(results)
      res.json(results)
    }
  })
})

// Lets you delete user by its username
app.delete('/user', (req, res) => {

  const { username } = req.body;

  connection.query('DELETE FROM user WHERE username = ?', [username], err => {
    if (err) {
      //  console.log(err);
      res.status(500).send("Error deleting user");
    } else {
      res.sendStatus(200);
    }
  });
});


// It's supposed to led you change the user information
// app.put('/user', (req, res) => {

//   // Get the data sent
//   const formData = req.body;
//   const username = req.body.username;

//    connection.query('UPDATE user SET ? WHERE username = ?', [formData, username], err => {
//     if (err) {
//        console.log(err);
//       res.status(500).send("Error editing the user");
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });




// app.post('/login', (req, res) => {
//   console.log(req.body)

//   const { email, password } = req.body

//   // faig query a la taula USER filtrant per email
//   // NO existeix: res.status(400).send('Email not found')
//   // SI existes: segueixo

//   // faig query a la taula USER filtrant per hash(password) i per email alhora
//   // NO existeix: res.status(400).send('Pswd not found')
//   // SI existeix: res.json(result)


//   const formData = {
//     name: req.body.name,
//     username: req.body.username,
//     mail: req.body.mail,
//     password: req.body.password,
//   }
//   connection.query('INSERT INTO user SET ?', formData, (err) => {
//     if(err){
//       console.log(err)
//       res.status(500).send('Error registering your user')
//     } else {
//       res.sendStatus(200)
//     }
//   })
// });


// Lets you post a new user
app.post('/user', (req, res) => {
  // console.log("bodyyyyyyyyy", req.body)

  const formData = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    username: req.body.username,
    birth_date: req.body.birthdate,
    email: req.body.email,
    password: req.body.password,
    repeat_password: req.body.password,
  }
  connection.query('INSERT INTO user SET ?', formData, (err) => {
    if(err){
        console.log('pacooooooooo', err)
        res.status(500).send('Error registering your user')
    } else {
        res.sendStatus(200)
    }
  })
});

// sees if the user and password are in the database
app.post('/log', (req, res) => {

    // const formData = {
    //     username: req.body.username,
    //     password: req.body.password,
    // }

    console.log("requesttttttttt", req.body.username, req.body.password)

    connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [req.body.username, req.body.password], (err, results) => {
        if(err){
            console.log('error', err)
            res.status(500).send('No such user in the database')
        }

        if(results){
            req.session.regenerate( ()=>{
              req.session.login = true;
              req.session.username = req.body.username;
              //return the loged user to the front, to use this url for context
              console.log('results', results)
              res.json(results)

        });
    }
})
})



app.listen(port, (err) => {
    if(err) {
        throw new Error('Something did not work');
    }
    console.log(`Server is listening on port ${port}`);
});

