const fs = require("fs");
const queueName = './queue.json';
exports.run = async(client, message, args) => {

	const voiceChannel = message.member.voiceChannel;
	
	fs.readFile(queueName, 'utf8', (e, data) => {
			if (e){
				console.error(e)
			}else{
				let queue = JSON.parse(data);
				if (!queue.playing){
					console.log("Nothing is being played");
				} else{
					queue.songs[0] = null;
					fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => {
						client.dispatcher.end(); 
						if(e) return console.error(e)
					});					
				}
				
			}
		})

	
	
}