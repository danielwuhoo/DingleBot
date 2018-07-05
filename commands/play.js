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

	var songInfo = null;
	var song = null;

	if (args[0] != null){
		songInfo = await ytdl.getInfo(args[0]);
		song = {
			title: songInfo.title,
			url: songInfo.video_url
		};	
	}


	fs.readFile(queueName, 'utf8', (e, data) => {
		if (e){
			console.error(e)
		}else{
			let queue = JSON.parse(data);

			if(song != null){
				queue.songs.push(song);
			}


			if (!queue.playing){
				play(queue.songs[0]);
				queue.playing = true;
			} 

			fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});





			console.log(queue);			

		}
	})

	function play(song){
	if(!song || song == null){
		fs.readFile(queueName, 'utf8', (e, data) => {
			if (e){
				console.error(e)
			}else{
				let queue = JSON.parse(data);
				queue.playing = false;
				fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
			}
		})
		voiceChannel.leave();
		return;
	}
	client.dispatcher = connection.playStream(ytdl(song.url, {filter: "audioonly"}))
		.on('end', () => {
			fs.readFile(queueName, 'utf8', (e, data) => {
				if (e){
					console.error(e)
				}else{
					let queue = JSON.parse(data);
					if (queue.songs.shift() != null){
						play(queue.songs[0]);
					} else{
						play(null);
					}
					console.log(queue);
					fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
					
				}
			})
		})
		.on('error', e => console.error(e));

	}

};

