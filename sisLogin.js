var settings = require('./settings.js');
var rin = settings.RIN;
var password = settings.SIS_PASSWORD;
var semester = settings.SEMESTER;

var request = require('request');

/* Pretend to visit login page */
var initCookie = function(rin, password, semester){
    var jar = request.jar();
    request.get({
            uri: "https://sis.rpi.edu/rss/twbkwbis.P_WWWLogin",
            jar: jar
    }, function(error, response, body){
        if(error){
            console.error(error);
        }else {
            loginSite(rin, password, semester, jar);
        }
    });
}(rin, password, semester);

/* Authenticate against SIS */
var loginSite = function(rin, password, semester, jar){
    var loginForm = {
        sid: rin,
        PIN: password
    };
    request.post({
        uri: "https://sis.rpi.edu/rss/twbkwbis.P_ValLogin",
        formData: loginForm,
        jar: jar
    }, function(error, response, body){
        if(error){
            console.error(error);
        }else {
            loadSchedule(semester, jar);
        }
    });
}

/* Download Schedule for current semester */
var loadSchedule = function(semester, jar){
    var scheduleForm = {
        term_in: semester
    };
    request.post({
        uri: "https://sis.rpi.edu/rss/bwskfshd.P_CrseSchdDetl",
        jar: jar,
        formData: scheduleForm
    }, function(error, response, body){
        if(error){
            console.error(error);
        }else{
            parseSchedule(body);
        }
    });
}

/* Use string parsing to get the CRN's out */
var parseSchedule = function(html_body){
    while(true){
        var crn_start = html_body.search("CRN");
        if(crn_start < 0){
            break;
        }
        crn_start += 42; //Offset for garbage before CRN
        html_body = html_body.slice(crn_start);
        var end = html_body.search('<');
        console.log("CRN: " + html_body.slice(0, end));
        html_body = html_body.slice(end);
    }
}
