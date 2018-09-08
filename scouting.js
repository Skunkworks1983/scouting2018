#!/usr/bin/env nodejs

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pg = require("pg");
const app = express();
const port = 8080;

const matches =
    [{comp_level:'qm', alliances:{red:{teams:['0000','0000','0000']},blue:{teams:['0000','0000','0000']}}}];

const conString = "pg://skunkadmin:scouterspowerlevelis1983@scoutingdata.ck2iryvzyhsg.us-east-1.rds.amazonaws.com:5432/scoutingdata";

var client = new pg.Client(conString);
client.connect();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    next();
});

app.use(express.static('client'));

app.get('/', function(req, res) {
    //console.log(req.body);
    res.sendFile(path.join(__dirname + '/client/mainPage.html'));
});

app.get('/matches', function(req, res) {
    res.send(JSON.stringify(matches));
});

app.post('/', function(req, res) {
    console.log(getJsonValues(req.body));
    //TODO: Match # of $x subs with the # of columns in the DB
    let query;
    try {
        query = client.query("INSERT INTO matches VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)", getJsonValues(req.body));
    } catch (err) {
        console.log("Something went very wrong, Patrick must have coded this part");
        console.log(err);
    }
    console.log(query);

    query.then("end", function (result) {
        console.log(result);
        console.log("Added DB row");
    });
    var IT_WORKED = true;
    var ERR = "Incompetence is Patrick's best character trait";

    if(IT_WORKED) {
        res.send("success");
    } else {
        res.send(ERR);
    }
});

app.listen(port, function(err) {
    if(err) {
        return console.log("Something bad happened: ", err);
    }

    console.log("Server is listening on ", port);
});

function getJsonValues(arr) { //We call this arr because Eli's a dingleberry
    retArr = [];
    for(var key in arr) {
        retArr.push(arr[key]);
        // if(arr.hasOwnProperty(key)) {
        //     retArr.push(arr.key);
        // }
    }

    return retArr;
}
