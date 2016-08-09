/* Created by Elusive7 on 8/9/2016 */
/* Web Crawler for Auto ELO Tracking */

//User defined variables
var person = "Noctierre";
var server = "na";

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var START_URL = ("http://" + server + ".op.gg/summoner/userName=" + person);
var url = new URL(START_URL);

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
    if(error) {
        console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)
    if(response.statusCode === 200) {
        // Parse  document body
        var $ = cheerio.load(body);

        console.log("Pulling data from op.gg to check " + "'" + person + "'s current rank..");

        // true or false
        var isWordFound = searchForWord($, SEARCH_PLAT);
        if (!isWordFound) {
            isWordFound = searchForWord($, SEARCH_DIA);
        }
        if (!isWordFound) {
            isWordFound = searchForWord($, SEARCH_GOLD);
        }
        if (!isWordFound) {
            isWordFound = searchForWord($, SEARCH_MASTER);
        }
        if (!isWordFound) {
            isWordFound = searchForWord($, SEARCH_CHALLENGER);
        }
        if (!isWordFound) {
            isWordFound = searchForWord($, SEARCH_BRONZE);
        }

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
                default:
                    console.log("Couldn't find " + person + " :|");
            }
        }
    }
});

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function returnRanking($, word) {
    var bodyText = $('html > body').text();
    var temp = bodyText.indexOf(word);

    //TODO: OP.GG TREATS CHALLENGERS AS MASTERS
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
        //console.log("your rank is: " + rank);
        if (flag == 1) {
            i = x + 10;
            //console.log("char at i is: " + bodyText.charAt(i));
        }
        if (bodyText.charAt(i) == ' ') {
            //console.log("does this ever work?");
            flag = 1;
        }
    }

    //Get points and lp
    var lp_5 = bodyText.charAt(temp-6);
    var lp_7 = bodyText.charAt(temp-4);
    var lp_8 = bodyText.charAt(temp-3);
    var lp_9 = bodyText.charAt(temp-2);
    var sum = "" + lp_5 + lp_7 + lp_8 + lp_9;
    var temporary = bodyText.substring(temp-1, temp+2);

    //handle 0lp case
    if (!(lp_7 >= 1 && lp_7 <= 9) && !(lp_8 >= 1 && lp_8 <= 9) && (lp_9 === '0')) {
        //console.log("ugh");
        var lp = lp_9 + temporary;
    }

    //handle 100lp case
    if ("" + lp_7 + lp_8 + lp_9 === '100'){
        var lp = lp_7 + lp_8 + lp_9 + temporary;
    }

    //handle 0<x<10 lp
    if ("" + lp_9 > 0 && "" + lp_9 < 10) {
        var lp = lp_9 + temporary;
    }

    //handle 10<x<100 lp
    if ("" + lp_8 + lp_9 >= 10) {
        var lp = lp_8 + lp_9 + temporary;
    }

    //handle 100<x<1000 lp
    if ("" + lp_7 + lp_8 + lp_9 > 100){
        var lp = lp_7 + lp_8 + lp_9 + temporary;
    }

    //handle 1000<x lp
    if ("" + lp_5 + lp_7 + lp_8 + lp_9 >= 1000) {
        var lp = lp_5 + lp_7 + lp_8 + lp_9 + temporary;
    }

    //Calculate final result
    if (sum > 400)
        return ("Challenger" + "\n" + lp);

    else if (sum < 400 && sum > 100)
        return ("Master" + "\n" + lp);

    else {
        return rank + '\n' + lp;
    }

}