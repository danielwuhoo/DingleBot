const ytdl = require("ytdl-core");
const fs = require("fs");
const queueName = './queue.json';
exports.run = async(client, message, args) => {
	
	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return msg.channel.send('Join a voice channel to play music.');


	try {
		var connection = await voiceChannel.join();
	} catch (e){
		console.error(`Unable to join voice channel: ${e}`);
		return message.channel.send(`Unable to join voice channel: ${e}`);
	}

	const songInfo = await ytdl.getInfo(args[0]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url
	};

	fs.readFile(queueName, 'utf8', (e, data) => {
		if (e){
			console.error(e)
		}else{
			let queue = JSON.parse(data);
			
			if (!queue.songs.length){
				queue.songs.push(song);
				play(queue.songs[0]);
			} else{
				queue.songs.push(song);
			}

			fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});





			console.log(queue);			

		}
	})

	function play(song){
	if(!song){
		voiceChannel.leave();
		return;
	}
	const dispatcher = connection.playStream(ytdl(song.url, {filter: "audioonly"}))
		.on('end', () => {
			fs.readFile(queueName, 'utf8', (e, data) => {
				if (e){
					console.error(e)
				}else{
					let queue = JSON.parse(data);
					queue.songs.shift();
					fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
					play(queue.songs[0]);
				}
			})
		})
		.on('error', e => console.error(e));

	}

};

