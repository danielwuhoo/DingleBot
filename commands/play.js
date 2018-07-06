const ytdl = require("ytdl-core");
const youtube = require("simple-youtube-api");
const color = require("dominant-color");
const fs = require("fs");
const Discord = require("discord.js");
const queueName = './queue.json';
const request = require("request");

exports.run = async(client, message, args) => {
	const yt = new youtube(client.config.google);
	const musicChannel = client.channels.get(client.config.music);
	const input = args.join(" ");
	const voiceChannel = message.member.voiceChannel;


	if (!voiceChannel) return msg.channel.send('Join a voice channel to play music.');


	try {
		var connection = await voiceChannel.join();
	} catch (e){
		console.error(`Unable to join voice channel: ${e}`);
		return message.channel.send(`Unable to join voice channel: ${e}`);
	}

	try{
		var video = await yt.getVideo(input);
	} catch (error){
		try{
			var videos = await yt.searchVideos(input, 1);
			var video = await yt.getVideoByID(videos[0].id);
		} catch (e){
			console.error(e);
			return message.channel.send(`Unable to find video.`);
		}
	}

	var song = null;

	if (args[0] != null){
		song = {
			title: video.title,
			url: `https://www.youtube.com/watch?v=${video.id}`,
			duration: video.duration,
			thumbnail: video.maxRes.url
		};	
	}



	fs.readFile(queueName, 'utf8', (e, data) => {
		if (e){
			console.error(e)
		}else{
			let queue = JSON.parse(data);
			queue.channel = voiceChannel.name;
			if(song != null){
				queue.songs.push(song);
			}
			if (!queue.playing){
				play(queue.songs[0]);
				queue.playing = true;
			} 
			updateMenu(queue);


			fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
		

		}
	})

	function play(song){
	if(!song || song == null){
		fs.readFile(queueName, 'utf8', (e, data) => {
			if (e){
				console.error(e)
			}else{
				let queue = JSON.parse(data);
				queue.channel = null;
				queue.playing = false;
				fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
				updateMenu(queue);
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
					updateMenu(queue);
					fs.writeFile('./queue.json', JSON.stringify(queue), 'utf8', e => { if(e) return console.error(e)});
					
				}
			})
		})
		.on('error', e => console.error(e));

	}

	function updateMenu(queue){
		musicChannel.fetchMessage(client.config.menu).then(msg => {
			client.menu = new Discord.RichEmbed();
			

			client.menu.setAuthor((queue.channel == null)? `Not connected to a voice channel`:`Connected to: ${queue.channel}`, "https://i.imgur.com/0eJFKFU.png");
			if (queue.songs[0] == null){
				client.menu.setDescription(`**Queue is currently empty**`)
				client.menu.setColor("aaaaaa");
			} else{
				request(queue.songs[0].thumbnail).pipe(fs.createWriteStream('./assets/thumb.jpg'))
					.on('finish', () => {
						color('./assets/thumb.jpg', (e, col) =>{
							
							client.menu.setColor(col);
							msg.edit(client.menu);
						});
					});

				
				client.menu.setDescription(`**Currently playing: **${queue.songs[0].title}\n**Duration: **${durationToString(queue.songs[0].duration)}`);
				client.menu.setThumbnail(queue.songs[0].thumbnail);
				
				
				
			}

			for(let i = 1; i < queue.songs.length; i++){
				client.menu.addField(`**${i+1}. **${queue.songs[i].title}`, `Duration: ${durationToString(queue.songs[i].duration)}`);
			}

			client.menu.setFooter(`${queue.songs.length} song` + ((queue.songs.length == 1)? "":"s") );
			client.menu.setTimestamp();
			
			msg.edit(client.menu);
		});

	}

	function durationToString(dur){
		let string = `${dur.seconds}s`;
		if (dur.minutes){
			string =`${dur.minutes}m ` + string;
		}
		if (dur.hours){
			string =`${dur.hours}hr ` + string;
		}
		return string;
	}

};

