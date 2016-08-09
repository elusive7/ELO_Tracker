var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

//User defined variables
var person = "Noctierre";
var server = "na";

var START_URL = ("http://" + server + ".op.gg/summoner/userName=" + person);
var url = new URL(START_URL);

//Potential divisions
var SEARCH_CHALLENGER = "Challenger";
var SEARCH_MASTER = "Master";
var SEARCH_DIA = "Diamond";
var SEARCH_PLAT = "Platinum";
var SEARCH_GOLD = "Gold";
var SEARCH_SILVER = "Silver";
var SEARCH_BRONZE = "Bronze";

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
        var hisRanking = returnRanking($, 'LP');

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
    var x = bodyText.indexOf(SEARCH_PLAT);

    var rank = "";

    //Get rank and division
    if (SEARCH_CHALLENGER || SEARCH_PLAT) {
        for (var i = x; i < x+10; i++) {
            rank = rank + bodyText.charAt(i);
            //console.log("your rank is: " + rank);
        }
    }

    else if (SEARCH_MASTER || SEARCH_SILVER || SEARCH_BRONZE) {
        for (var i = x; i < x+6; i++) {
            rank = rank + bodyText.charAt(i);
        }
    }

    else if (SEARCH_DIA) {
        for (var i = x; i < x+7; i++) {
            rank = rank + bodyText.charAt(i);
        }
    }

    else if (SEARCH_GOLD) {
        for (var i = x; i < x+4; i++) {
            rank = rank + bodyText.charAt(i);
        }
    }

    //Get points and lp
    var lp_7 = bodyText.charAt(temp-4);
    var lp_8 = bodyText.charAt(temp-3);
    var lp_9 = bodyText.charAt(temp-2);
    var temporary = bodyText.substring(temp-1, temp+2);

    //handle 100lp case
    if (((lp_8 === '0') && (lp_9 === '0'))){
        var lp = lp_7 + lp_8 + lp_9 + temporary;
    }

    //handle 0lp case
    else if (lp_9 === 10) {
        var lp = lp_9 + temporary;
    }

    //handle XX lp case
    else {
        var lp = lp_8 + lp_9 + temporary;
    }

    //Calculate result
    return rank + '\n' + lp;
}