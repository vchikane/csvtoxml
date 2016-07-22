var express = require('express');
var router = express.Router();
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var js2xmlparser = require("js2xmlparser");
var xml = require('xml');

/* GET home page. */
router.get('/', function(req, res, next) {
	//end_parsed will be emitted once parsing finished
	converter.on("end_parsed", function (jsonArray) {
	    console.log(jsonArray); //here is your result jsonarray
	    var jsonString = JSON.stringify(jsonArray);
	    //console.log(jsonString);
	    var xmltosend = js2xmlparser("CUBXML", jsonString);
    	console.log(xmltosend);
    	res.set('Content-Type', 'text/text');
    	//res.send(xml(xmltosend));
    	// res.send("xml generated successfully!");
    	var testXML = "<?xml version=1.0 encoding=UTF-8?><note><from>Jani</from><to>Tove</to><message>Remember me this weekend</message></note>"
		res.send(testXML);
	});

	//read from file
	require("fs").createReadStream("./CUB_FILE.csv").pipe(converter);

});

module.exports = router;