// Import dependencies

//expess is an HTTP framework for handling requests
const express = require('express');
//create an instance of express framework
const app = express(); 
// DBMS Mysql 
const mysql = require('mysql2');
// Cross Origin Resourse Sharing 
const cors = require('cors');
// Environment variable doc 
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

//check if db connection works 
db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to the database");

    //If connection is successful
    console.log("Connected successfully as id: ", db.threadId); 
}) 

//GET METHOD CODE
//question 1
//GET patients data
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//patients is the name of the file inside views folder 
app.get('/patients', (req,res) => {

    // Retrieve patients data from database 
    db.query('SELECT patient_id, first_name, last_name,date_of_birth FROM patients', (err, results) =>{
        if (err){
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            //Display patient data to the browser 
            res.render('patients', {results: results});
        }
    });
});
// END of Q1

//question 2
//GET providers data
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//providers is the name of the file inside views folder 
app.get('/providers', (req,res) => {

    // Retrieve providers data from database 
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) =>{
        if (err){
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            //Display providers data to the browser 
            res.render('providers', {results: results});
        }
    });
});
// END of Q2

//Q3
//Filter patients by First Name
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//patientsbyFname is the name of the variable that holds the results from the query 
app.get('/patientsbyFname', (req,res) => {

    // Retrieve patients data from database Filtered by First Name
    const patientsbyFname = "SELECT * FROM patients WHERE first_name='?'"
    db.query(patientsbyFname, (err, results) =>{
        if (err){
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            //Display patient data to the browser 
            res.status(200).send(results)
        }
    });
});
//END of Q3

//Q4
//GET providers data by specialty
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// getProviders is the name of the variable that holds the results from the query
// - localhost:3000/get-providers -link to view in browser
app.get('/get-providers', (req, res) => {
    const getProviders = "SELECT * FROM providers WHERE provider_specialty='?' "
    db.query(getProviders, (err, data) => {
        // if I have an error 
        if(err) {
            return res.status(400).send("Failed to get Providers", err)
        }

        // res.status(200).render('data', { data })
        res.status(200).send(data)
    });
});
//END of Q4

//END OF GET METHOD CODE


// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser 
    console.log('Sending message to the browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});
