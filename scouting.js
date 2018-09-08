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
        {comp_level:'qm', match_number:'14', alliances:{blue:{teams:['5803','2976','1983']},red:{teams:['3663','1318','948']}}},
        {comp_level:'qm', match_number:'15', alliances:{blue:{teams:['1778','6343','2733']},red:{teams:['2522','2811','4692']}}},
        {comp_level:'qm', match_number:'16', alliances:{blue:{teams:['5827','1983','2910']},red:{teams:['5588','360','4450']}}},
        {comp_level:'qm', match_number:'17', alliances:{blue:{teams:['4911','9994','3663']},red:{teams:['4469','948','3145']}}},
        {comp_level:'qm', match_number:'18', alliances:{blue:{teams:['2976','4131','4180']},red:{teams:['2046','2930','5803']}}},
        {comp_level:'qm', match_number:'19', alliances:{blue:{teams:['1983','2557','1318']},red:{teams:['2928','6350','9994']}}},
        {comp_level:'qm', match_number:'20', alliances:{blue:{teams:['948','6343','2522']},red:{teams:['2930','5827','2811']}}},
        {comp_level:'qm', match_number:'21', alliances:{blue:{teams:['360','3145','4911']},red:{teams:['2976','1778','6350']}}},
        {comp_level:'qm', match_number:'22', alliances:{blue:{teams:['2910','5588','4469']},red:{teams:['1318','2733','2046']}}},
        {comp_level:'qm', match_number:'23', alliances:{blue:{teams:['3663','4131','4692']},red:{teams:['4450','2928','4180']}}},
        {comp_level:'qm', match_number:'24', alliances:{blue:{teams:['5803','2811','3145']},red:{teams:['2557','2046','360']}}},
        {comp_level:'qm', match_number:'25', alliances:{blue:{teams:['5827','4469','9994']},red:{teams:['4692','2976','2928']}}},
        {comp_level:'qm', match_number:'26', alliances:{blue:{teams:['5588','1318','2522']},red:{teams:['2557','2930','3663']}}},
        {comp_level:'qm', match_number:'27', alliances:{blue:{teams:['6350','4450','2733']},red:{teams:['948','1778','4180']}}},
        {comp_level:'qm', match_number:'28', alliances:{blue:{teams:['2910','5803','4131']},red:{teams:['1983','4911','6343']}}},
    ];

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
