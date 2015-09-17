var settings = require('./settings.js');
var semester = settings.SEMESTER;
var request = require('request');

/* Download schedule for current semester */
var getSchedule = function(semester){
    console.log("Getting courses for semester: " + semester);
    /* Build course URL */
    var course_url = "http://sis.rpi.edu/reg/zs" + semester + ".htm";
    console.log("Loading course from URL: " + course_url);

    request.get({
        uri: course_url
    },function(error,response,body){
        if(error){
            return console.error("ERROR: Failed to load course: " + error);
        }
        parseSchedule(body);
    });
}(semester);

var parseSchedule = function(schedule_doc){
    var jsdom = require('jsdom');

    jsdom.env(schedule_doc, function(error, window){
        if(error){
            return console.error("ERROR: Failed to parse courses: " + error);
        }
        var root_div = window.document.evaluate('//*[@id="pp1"]', window.document).iterateNext();
        console.log(root_div);
    });
}
