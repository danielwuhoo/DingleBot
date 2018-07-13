const queueName = './queue.json';
const functions = require("../modules/functions.js");

module.exports = async client => {

	functions.updateFile(queueName, (queue) =>{
		queue.playing = false;
	});
		
	console.log(`${client.user.username} is online!`);
};