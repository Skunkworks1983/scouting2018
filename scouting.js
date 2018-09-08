#!/usr/bin/env nodejs

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pg = require("pg");
const app = express();
const port = 8080;

const matches =
    [{comp_level:'qm', match_number:'1', alliances:{blue:{teams:['1778','5827','2557']},red:{teams:['4131','2046','1983']}}},
        {comp_level:'qm', match_number:'2', alliances:{blue:{teams:['9994','5827','2557']},red:{teams:['4131','2046','1983']}}},
        {comp_level:'qm', match_number:'3', alliances:{blue:{teams:['1778','5827','2557']},red:{teams:['4131','2046','1983']}}},
        {comp_level:'qm', match_number:'4', alliances:{blue:{teams:['6343','6350','2811']},red:{teams:['4469','3663','2976']}}},
        {comp_level:'qm', match_number:'5', alliances:{blue:{teams:['2928','948','5588']},red:{teams:['3145','2522','4131']}}},
        {comp_level:'qm', match_number:'6', alliances:{blue:{teams:['2046','3663','6343']},red:{teams:['9994','2733','360']}}},
        {comp_level:'qm', match_number:'7', alliances:{blue:{teams:['2522','2557','2928']},red:{teams:['4450','2910','2976']}}},
        {comp_level:'qm', match_number:'8', alliances:{blue:{teams:['2930','4180','4469']},red:{teams:['3145','1983','1778']}}},
        {comp_level:'qm', match_number:'9', alliances:{blue:{teams:['6350','4692','4911']},red:{teams:['5588','5803','5827']}}},
        {comp_level:'qm', match_number:'10', alliances:{blue:{teams:['2811','4131','1778']},red:{teams:['1318','9994','2910']}}},
        {comp_level:'qm', match_number:'11', alliances:{blue:{teams:['6350','4469','2046']},red:{teams:['4911','2522','4450']}}},
        {comp_level:'qm', match_number:'12', alliances:{blue:{teams:['2811','2928','360']},red:{teams:['2733','5588','4930']}}},
        {comp_level:'qm', match_number:'13', alliances:{blue:{teams:['4180','3145','2557']},red:{teams:['6343','4692','5827']}}},
        {comp_level:'qm', match_number:'14', alliances:{blue:{teams:['5803','2976','1983']},red:{teams:['3663','1318','948']}}},];

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
