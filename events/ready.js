const fs = require("fs");
const queueName = './queue.json';
module.exports = async client => {
	fs.readFile(queueName, 'utf8', (e, data) => {
		if (e){
			console.error(e)
		}else{
			let queue = JSON.parse(data);
			queue.playing = false;
			fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => {if(e) return console.error(e)});					
		}
				
	})
		
	console.log(`${client.user.username} is online!`);
};