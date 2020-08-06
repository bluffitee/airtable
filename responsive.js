"use strict";

const express = require("express"); // for webpage managment with NodeJS
const bodyParser = require("body-parser"); // for parsing HTTP requests and responses
const exphbs = require("express-handlebars"); // web template middleware engine
const path = require("path"); // core JS module for handling file paths
const dotenv = require("dotenv"); // set up config for ".env" file
const axios = require('axios');

dotenv.config();

const responsive = express(); // creating a new webpage management instanc

// Declare view engine setup
responsive.engine("handlebars", exphbs());
responsive.set("view engine", "handlebars");

// Body Parser Middleware
responsive.use(bodyParser.urlencoded({ extended: false }));
responsive.use(bodyParser.json());

// This will print HTTP request methods live as they happen
responsive.use(function (req, res, next) {
	console.log(`Request –> (Method: ${req.method}, URL: ${req.url})`);
	next();
});

// Get root (index) route and display products
responsive.get("/", function (req, res) {
	let message = [], companies = [];
	axios({
	  method: 'get',
	  url: `https://api.airtable.com/v0/${process.env.AT_APP_ID}/Programs?api_key=${process.env.AT_API_KEY}`
	})
	.then((response) => {
		message = [...response.data.records];
		for (var i = 0; i < message.length; i++) {
			companies.push(message[i].fields)
		}
		res.render("index", {
			data: companies,
			msg: "<h1>Hello, World!</h1>",
			layout: false,
		});
	})
  .catch((err) => console.error(err));


});

// Start the server on Unix environment variable PORT or 8080
const PORT = process.env.PORT || 5000;

responsive.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
	console.log("");
});

// export const
