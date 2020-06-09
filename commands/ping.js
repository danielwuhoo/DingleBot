const fs = require("fs");
const request = require("request");

const color = require("dominant-color");
exports.run = async(client, message, args) => {

	client.channels.cache.get("719944358551486504").send('My Message');
	// color('./assets/thumb.jpg', (e, color) =>{
	// 	console.log(color);
	// });
	
};