// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "mydb_admin",
    password: "@Omaha00",
    database:"mydb"
});

connection.connect();

console.log("connected!");

var strQuery = 'select * from users.users';
  
connection.query(strQuery, function(err, rows, fields) {
    console.log('The User records are: ', rows);
    // console.log(fields);
});

console.log('executing query...');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// read local files
// app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('views'));
app.use(express.static('js'));
app.use(express.static('css'));

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/users')
  
// get all users

.get(function(req, res, err) {
    var strQuery = 'select * from users.users';
    connection.query(strQuery, function(err, rows) {
        res.send(rows);
        console.log("err" + err);
    });
})

//create new users
    .post(function(req, res) {
        connection.query('insert into users.users SET ?', req.body, function(err, rows) {
            res.send(req.body);
            console.log(req.body);
            console.log("user created");  
        });     
    });

router.route('/users/:user_id')

// get the user with id
    .get(function(req, res) {
        connection.query('SELECT * FROM users.users where id = ?', req.params.user_id, function(err, rows) {
            res.send(rows);
            return;
        });   
    })

//update user with id 
    .put(function(req, res) {
        var data = {
            fName: req.body.fName,
            lName: req.body.lName,
            title: req.body.title,
            sex: req.body.sex,
            age: req.body.age  
        };
        connection.query('update users.users SET ? where id = ?', [data, req.params.user_id], function(err, rows) {
            console.log(err);
            res.send(rows); 
        });          
    })
    
// delete user with id     
    .delete(function(req, res) {
        connection.query('delete from users.users where id= ?', req.params.user_id, function(err, rows) {
            console.log(req.params);
            res.send(rows);
            console.log("user deleted"); 
        });          
    })      

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// end database connection


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);