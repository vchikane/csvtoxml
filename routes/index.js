var express = require('express');
var router = express.Router();
var xml = require('xml');
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var inputFile='CUB_FILE.csv';


var finalArr = [];
var xmlToSend = "";

/* GET all branch details. */
router.post('/all_branch', function(req, res, next) {
	var counter = 0;
	var headers = [];
	var parser = parse({delimiter: ','}, function (err, data) {
	    b=[]
	    obj={xml:[]}
	    b[0]=obj
	    async.eachSeries(data, function (line, callback) {
		    // line is the file's row, play with line now
		    if(counter==0) {
		    	for (var j = 0; j < line.length; j++) {
		    		headers[j] = line[j];
		    	}
		    	counter++;
		    } 
		    else {
		    	var arr2 = [];
		    	for (var i = 0; i < line.length; i++) {
		    		header = headers[i];
		    		row_value = line[i];
		    		obj1 = {}
		    		obj1[header] = row_value;
		    		arr2[i]=obj1;
		    	}
		    	finalxml = {Branch_Details : arr2};
		    	b[0].xml[counter-1]=(finalxml);
		    	counter++;
		    }
		    callback();
		});
    	res.set('Content-Type', 'text/xml');
    	res.send(xml(b));
	});

	fs.createReadStream(inputFile).pipe(parser);

});


/* GET a particular branch's detail. */
router.post('/branch', function(req, res, next) {
	var counter = 0;
	var headers = [];
	var parser = parse({delimiter: ','}, function (err, data) {
		var found = false;
	    b=[]
	    obj={xml:[]}
	    b[0]=obj
	    id = req.body._id;
	    async.eachSeries(data, function (line, callback) {
		    // line is the file's row, play with line now
		    if(counter==0) {
		    	for (var i = 0; i < line.length; i++) {
		    		headers[i] = line[i];
		    	}
		    	counter++;
		    } 
		    else {
		    	var arr2 = [];
		    	for (var i = 0; i < line.length; i++) {
		    		header = headers[i];
		    		row_value = line[i];
		    		obj1 = {}
		    		obj1[header] = row_value;
		    		arr2[i] = obj1;
		    		if(header==='BRANCH_NO' && row_value==id) {
		    			found = true;	
		    		}
		    	}
				
				if(found) {
					finalxml = {CUBXML : arr2};
		    		b[0].xml.push(finalxml);
				}
		    	
		    	counter++;
		    }
		    if(found)
		    	callback(true);
		    else
		    	callback();
		});
		console.log(found);
		console.log(JSON.stringify(b));
    	if(found) {
	    	res.set('Content-Type', 'text/xml');
    		res.send(xml(b));
    	}
    	else {
	    	res.set('Content-Type', 'text/plain');
    		res.send("No Record found!");
    	}
	});

	fs.createReadStream(inputFile).pipe(parser);

});

module.exports = router;