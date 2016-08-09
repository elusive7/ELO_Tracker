var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

//User defined variables
var person = "yoyoonarock";
var server = "na";

var START_URL = ("http://" + server + ".op.gg/summoner/userName=" + person);
var url = new URL(START_URL);

//Potential divisions
var SEARCH_CHALLENGER = "Challenger ";
var SEARCH_MASTER = "Master ";
var SEARCH_DIA = "Diamond ";
var SEARCH_PLAT = "Platinum ";
var SEARCH_GOLD = "Gold ";
var SEARCH_SILVER = "Silver ";
var SEARCH_BRONZE = "Bronze ";

var pageToVisit = "http://" + server + ".op.gg/summoner/userName=" + person;
console.log("Visiting " + pageToVisit);

request(pageToVisit, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)
    if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        var name = cheerio.load('<head>Hello</head>')

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
        //var hisDivision = returnRanking($, 'LP');

        if(isWordFound) {
            console.log(person + " is currently: " + '\n' + hisRanking);
            if (hisRanking.charAt(0) === 'P')
            {
                console.log(person + " is still Platinum, unlucky :|");
            }

            if (hisRanking.charAt(0) === 'G')
            {
                console.log('Definitely find a new game');
            }

            if (hisRanking.charAt(0) === 'D')
            {
                console.log(person + " is not bad now! Congrats!");
            }

            if (hisRanking.charAt(0) === 'M')
            {
                console.log("You're pretty talented!");
            }

            if (hisRanking.charAt(0) === 'C')
            {
                console.log("Why are using this");
            }

            if (hisRanking.charAt(0) === 'S')
            {
                console.log("Tough ELO :|");
            }

            if (hisRanking.charAt(0) === 'B')
            {
                console.log(". . .");
            }
        } else {
            console.log("Couldn't find " + person + " :|");
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

    //TODO: FIX MODIFY 'SEARCH_PLAT' TO 'SEARCH_X'
    //if (bodyText.indexOf(SEARCH_CHALLENGER) != -1)
    //    var x = bodyText.indexOf(SEARCH_CHALLENGER);
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


    //console.log(bodyText.indexOf(SEARCH_MASTER));
    var rank = "";
    var flag = 0;

    //Get rank and division
    //if (bodyText.indexOf(SEARCH_CHALLENGER) != -1 || bodyText.indexOf(SEARCH_PLAT) != -1 || bodyText.indexOf(SEARCH_DIA) != -1) {
    for (var i = x; i < x+10; i++) {
        rank = rank + bodyText.charAt(i);
        //console.log("your rank is: " + rank);
        if (flag == 1) {
            i = x + 10;
            //console.log("char at i is: " + bodyText.charAt(i));
        }
        if (bodyText.charAt(i) == ' ' || bodyText.charAt(i) == '\n' || bodyText.charAt(i) == '/') {
            //console.log("does this ever work?");
            flag = 1;
        }
    }

    //Get points and lp
    var lp_7 = bodyText.charAt(temp-4);
    var lp_8 = bodyText.charAt(temp-3);
    var lp_9 = bodyText.charAt(temp-2);
    var temporary = bodyText.substring(temp-1, temp+2);

    //handle 0lp case
    if (!(lp_7 >= 1 && lp_7 <= 9) && !(lp_8 >= 1 && lp_8 <= 9) && (lp_9 === '0')) {
        //console.log("ugh");
        var lp = lp_9 + temporary;
    }

    //handle 100lp case
    if (((lp_7 === '1') && (lp_8 === '0') && (lp_9 === '0'))){
        var lp = lp_7 + lp_8 + lp_9 + temporary;
    }

    //handle XX lp case
    if (lp_8 >= 1) {
        var lp = lp_8 + lp_9 + temporary;
    }

    //Calculate result
    return rank + '\n' + lp;
}