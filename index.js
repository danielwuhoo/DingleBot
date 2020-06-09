	
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

client.config = process.env;
client.commands = new Map();
client.menu = new Discord.MessageEmbed();
client.dispatcher = null;

fs.readdir("./commands/", (err, files) => {
	if (err){
		return console.error(err);
	}
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let cmd = require(`./commands/${file}`);
		client.commands.set(file.split(".")[0], cmd);

	});
});

fs.readdir("./events/", (err, files) => {
	if (err){
		return console.error(err);
	}
	files.forEach(file => {
		let event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));

	});

});

client.login(client.config.token);