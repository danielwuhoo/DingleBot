const functions = require("../modules/functions.js");
const { QUEUE } = require('../modules/constants.js');

module.exports = async client => {

	functions.updateFile(QUEUE, (queue) =>{
		queue.playing = false;
	});
		
	console.log(`${client.user.username} is online!`);
};