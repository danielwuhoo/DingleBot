const functions = require("../modules/functions.js");
const { QUEUE } = require('../modules/constants.js');

exports.run = async(client, message, args) => {

	await functions.updateFile(QUEUE, (queue) =>{
		if (!queue.playing){
			console.log("Nothing is being played");
		} else{
			queue.songs[0] = null;
		}
	});
	client.dispatcher.emit('finish');
	
	
	
	
}