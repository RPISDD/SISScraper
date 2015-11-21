var settings = require('./settings.js');
var semester = settings.SEMESTER;
var request = require('request');

/* Download schedule for current semester */
var getSchedule = function(semesters){
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
		//console.log(body);
        parseSchedule(body);
    });
}(semester);

var parseSchedule = function(schedule_doc){
	var index = schedule_doc.search(/\b\d{5}[ ]\b/g);
	var count = 0;
	while(index != -1){
		current_class = schedule_doc.substr(index,schedule_doc.length)
		endclass = current_class.indexOf("</TR>");
		current_class = current_class.substring(0,endclass);
		crn = current_class.substring(0,5);
		current_class = current_class.substring(5,current_class.length);
		endsname = current_class.indexOf("<");
		sname = current_class.substring(1,endsname);
		current_class = current_class.substring(endsname,current_class.length);
		beglname = current_class.indexOf("\">");
		current_class = current_class.substring(beglname+1,current_class.length);
		endlname = current_class.indexOf("<");
		lname = current_class.substring(1,endlname);	
		current_class = current_class.substr(endlname,current_class.length);
		dayindex = current_class.search(/[M|T|W|R|F|\s]{4,6}/g);
		console.log(crn);
		console.log(sname);
		console.log(lname);
		if(dayindex != -1)
		{
			days = current_class.substring(dayindex,dayindex+5);
			days = days.replace(/\s+/g, '');
			console.log(days);
		}
		current_class = current_class.substr(dayindex+6,current_class.length);
		time = current_class.match(/[0-9]{1,2}:[0-9]{2}/g);
		console.log(time);
		count++;
		schedule_doc = schedule_doc.substring(endclass,schedule_doc.length);
		index = schedule_doc.search(/\b\d{5}[ ]\b/g);
	}
	console.log(count);
	//crns = schedule_doc.match(/\b\d{5}[ ]\b/g);
	//name = schedule_doc.match(/\b\w[A-Z]{3}[-][0-9]{4}\b/g);
    //days = schedule_doc.match(/\b[M|T|W|R|F| ]{4}\b/g);
	//time = schedule_doc.match();
	//console.log(crns.length);
	//console.log(name.length);
	//console.log(days.length);
};