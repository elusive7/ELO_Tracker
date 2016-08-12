/* Created by Elusive7 on 8/9/2016 */
/* Web Crawler for Auto ELO Tracking */

/* TODO: ADD FIX FOR IF USER IS IN RANKED TEAMS */

<<<<<<< HEAD
//var person = "";
=======
//User defined variables, SET PERSON AND SERVER MANUALLY!
>>>>>>> 97d739c7999a802a116e661c897e1fe1e082592e
var person = "Noctierre";
var server = "na";

//Required node libs
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var process = require('process');
<<<<<<< HEAD
//var twilio = require('twilio');
var START_URL = ("http://" + server + ".op.gg/summoner/userName=" + person);
var url = new URL(START_URL);

//var client = twilio('myID', 'myToken');
=======
var twilio = require('twilio');
>>>>>>> 97d739c7999a802a116e661c897e1fe1e082592e

var final_output = "";

//Potential divisions
var SEARCH_CHALLENGER = "Challenger";
var SEARCH_MASTER = "Master ";
var SEARCH_DIA = "Diamond ";
var SEARCH_PLAT = "Platinum ";
var SEARCH_GOLD = "Gold ";
var SEARCH_SILVER = "Silver ";
var SEARCH_BRONZE = "Bronze ";

var pageToVisit = "http://" + server + ".op.gg/summoner/userName=" + person;

request(pageToVisit, function(error, response, body) {
    if(error)
        console.log("Error: " + error);

    // Check status code (200 is HTTP OK)
    if(response.statusCode === 200) {
        // Parse document body
        var $ = cheerio.load(body);

        var d = new Date();
        console.log("Checking " + person + "'s current rank as of " + d + "..");

        // check which division they are in
        var isWordFound = searchForWord($, SEARCH_PLAT);

        if (!isWordFound)
            isWordFound = searchForWord($, SEARCH_DIA);
        if (!isWordFound)
            isWordFound = searchForWord($, SEARCH_GOLD);
        if (!isWordFound)
            isWordFound = searchForWord($, SEARCH_MASTER);
        if (!isWordFound)
            isWordFound = searchForWord($, SEARCH_CHALLENGER);
        if (!isWordFound)
            isWordFound = searchForWord($, SEARCH_BRONZE);

        var hisRanking = returnRanking($, 'LP');
        if(isWordFound) {
            console.log(person + " is currently: " + '\n' + hisRanking);
            switch(hisRanking.charAt(0).toString()) {
                case 'C': {
                    console.log("Why are you using this");
                    break;
                }
                case 'M': {
                    console.log("You're pretty talented");
                    break;
                }
                case 'D': {
                    console.log("You're not bad now! Good job!");
                    break;
                }
                case 'P': {
                    console.log(person + " is still Platinum, unlucky :|");
                    break;
                }
                case 'G': {
                    console.log('Definitely find a new game');
                    break;
                }
                case 'S': {
                    console.log("Tough ELO :|");
                    break;
                }
                case 'B': {
                    console.log(". . .");
                    break;
                }
            }
        }
        else
            console.log("Unable to find " + person);
    }
});

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function returnRanking($, word) {
    var bodyText = $('html > body').text();
    var temp = bodyText.indexOf(word);
    //TODO: OP.GG TREATS 'CHALLENGERS' === 'MASTERS'
    if (bodyText.indexOf(SEARCH_MASTER) != -1)
        var x = bodyText.indexOf(SEARCH_MASTER);
    if (bodyText.indexOf(SEARCH_DIA) != -1)
        var x = bodyText.indexOf(SEARCH_DIA);
    if (bodyText.indexOf(SEARCH_PLAT) != -1)
        var x = bodyText.indexOf(SEARCH_PLAT);
    if (bodyText.indexOf(SEARCH_GOLD) != -1)
        var x = bodyText.indexOf(SEARCH_GOLD);
    if (bodyText.indexOf(SEARCH_SILVER) != -1)
        var x = bodyText.indexOf(SEARCH_SILVER);
    if (bodyText.indexOf(SEARCH_BRONZE) != -1)
        var x = bodyText.indexOf(SEARCH_BRONZE);

    var rank = "";
    var flag = 0;

    //Get rank and division
    for (var i = x; i < x + 10; i++) {
        rank = rank + bodyText.charAt(i);
        if (flag == 1)
            i = x + 10;
        if (bodyText.charAt(i) == ' ')
            flag = 1;
    }

    //Get points and lp
    var lp_5 = bodyText.charAt(temp-6);
    var lp_7 = bodyText.charAt(temp-4);
    var lp_8 = bodyText.charAt(temp-3);
    var lp_9 = bodyText.charAt(temp-2);
    var sum = "" + lp_5 + lp_7 + lp_8 + lp_9;
    var lp_name = bodyText.substring(temp-1, temp+2);

    //handle 0lp case
    if (!(lp_7 >= 1 && lp_7 <= 9) && !(lp_8 >= 1 && lp_8 <= 9) && (lp_9 === '0'))
        var lp = lp_9 + lp_name;

    //handle 100lp case
    if ("" + lp_7 + lp_8 + lp_9 === '100')
        var lp = lp_7 + lp_8 + lp_9 + lp_name;

    //handle 0<x<10 lp
    if ("" + lp_9 > 0 && "" + lp_9 < 10)
        var lp = lp_9 + lp_name;

    //handle 10<x<100 lp
    if ("" + lp_8 + lp_9 >= 10)
        var lp = lp_8 + lp_9 + lp_name;

    //handle 100<x<1000 lp
    if ("" + lp_7 + lp_8 + lp_9 > 100)
        var lp = lp_7 + lp_8 + lp_9 + lp_name;

    //handle 1000<x lp
    if ("" + lp_5 + lp_7 + lp_8 + lp_9 >= 1000)
        var lp = lp_5 + lp_7 + lp_8 + lp_9 + lp_name;

    //Calculate final result
    if (sum > 400)
        final_output = ("Challenger" + "\n" + lp);

    else if (sum < 400 && sum > 100)
        final_output = ("Master" + "\n" + lp);

    else
        final_output = rank + '\n' + lp;

    /*
    //uses Twilio to send sms
    client.sendMessage({
        to: '17328958345',
        from: '7326390801',
        body: "ELO Tracking.. " + person + " is currently: " + final_output + ". Unlucky :|"
    });
    console.log("sent");
    */
    return final_output;
}

