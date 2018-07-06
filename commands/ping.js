const fs = require("fs");
const request = require("request");

const color = require("dominant-color");
exports.run = async(client, message, args) => {

	color('./assets/thumb.jpg', (e, color) =>{
		console.log(color);
	});
	
};