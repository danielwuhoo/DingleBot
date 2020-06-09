const queueName = './queue.json';
const functions = require("../modules/functions.js");

exports.run = async(client, message, args) => {

	await functions.updateFile(queueName, (queue) =>{
		if (!queue.playing){
			console.log("Nothing is being played");
		} else{
			queue.songs[0] = null;
		}
	});
	client.dispatcher.emit('finish');
	
	
	
	
}