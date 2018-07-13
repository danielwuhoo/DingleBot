const queueName = './queue.json';
const functions = require("../modules/functions.js");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	const musicChannel = client.channels.get(client.config.music);
	const msg = await musicChannel.fetchMessage(client.config.menu);
	functions.updateFile(queueName, (queue) => {
		let qSize = queue.songs.length;
		//check for duplicates
		try{
			if (args[0].length == 0){
				throw new Error("No argument specified.");
			} 
			if (args[0] == "all"){
				queue.songs = [];
				client.dispatcher.end();
				return;
			}
			args.forEach((arg) => {
				if (isNaN(arg) || arg < 1){
					throw new Error("Please input valid arguments.");
				}

				if (arg == 1){
					throw new Error("Song is currently playing.");
				}

				if (arg > qSize){
					throw new Error("Song does not exist.");
				}

			});
		} catch (e){
	    	functions.updateMenu(msg, new Discord.RichEmbed(), queue, e);
	    	return;
		}
		args.sort((a,b) => {return b - a});
		args.forEach((arg) => {
			queue.songs.splice(arg - 1, 1);

		});
		functions.updateMenu(msg, new Discord.RichEmbed(), queue);


	});

};