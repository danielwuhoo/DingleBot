const fs = require("fs");
const queueName = './queue.json';
exports.run = async(client, message, args) => {
	fs.readFile(queueName, 'utf8', (e, data) => {
			if (e){
				console.error(e)
			}else{
				let queue = JSON.parse(data);
				if (!queue.playing){
					console.log("Nothing is being played");
				} else{
					client.dispatcher.end();				
				}
				
			}
		})

	
	
}