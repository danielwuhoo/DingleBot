const fs = require("fs");
const request = require("request");

const dcolor = require('image-average-color');
exports.run = async (client, message, args) => {

	client.channels.cache.get("719944358551486504").send('My Message');
	dcolor('./assets/thumb.jpg', (e, color) => {
		console.log(color);
	});

};