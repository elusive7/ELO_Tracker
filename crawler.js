setInterval(function(){}, 1000); // 5000 milliseconds

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var person = "Noctierre";

var START_URL = "http://na.op.gg/summoner/userName=" + person;
var url = new URL(START_URL);

var SEARCH_WORD = "Platinum";

var pageToVisit = "http://na.op.gg/summoner/userName=" + person;
console.log("Visiting page " + pageToVisit);

request(pageToVisit, function(error, response, body) {
    if(error) {
        console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)
    if(response.statusCode === 200) {
        // Parse the document body
        var $ = cheerio.load(body);
        console.log("Running a checker on op.gg to check " + person + "'s Rank..");

        // true or false
        var isWordFound = searchForWord($, SEARCH_WORD);
        var hisRanking = returnRanking($, 'LP');

        if(isWordFound) {
            console.log(person + " is currently: " + hisRanking);
            if (hisRanking.charAt(0) === 'G')
            {
                console.log('Definitely find a new game');
            }
            if (hisRanking.charAt(0) === 'P')
            {
                console.log(person + " is still Platinum, unlucky");
            }

            if (hisRanking.charAt(0) === 'D')
            {
                console.log(person + " is not bad now! Congrats!");
            }
        } else {
            console.log("Couldn't find " + person + " :(");
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

    var x = bodyText.indexOf('Platinum');

    //Get rank and division
    var rank_1 = bodyText.charAt(x);
    var rank_2 = bodyText.charAt(x+1);
    var rank_3 = bodyText.charAt(x+2);
    var rank_4 = bodyText.charAt(x+3);
    var rank_5 = bodyText.charAt(x+4);
    var rank_6 = bodyText.charAt(x+5);
    var rank_7 = bodyText.charAt(x+6);
    var rank_8 = bodyText.charAt(x+7);
    var rank_9 = bodyText.charAt(x+8);
    var rank_10 = bodyText.charAt(x+9);
    var rank = rank_1+rank_2+rank_3+rank_4+rank_5+rank_6+rank_7+rank_8+rank_9+rank_10;

    //Get points and lp
    var lp_8 = bodyText.charAt(temp-3);
    var lp_9 = bodyText.charAt(temp-2);
    var lp_10 = bodyText.charAt(temp-1);
    var lp_11 = bodyText.charAt(temp);
    var lp_12 = bodyText.charAt(temp+1);
    var lp = lp_8+lp_9+lp_10+lp_11+lp_12;

    //Calculate result
    var good_or_bad = rank + " " + lp;

    return good_or_bad;
}







