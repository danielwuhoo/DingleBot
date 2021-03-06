const request = require("request");

module.exports = (client, message) => {
	if (message.channel.id === client.config.music) {
		message.delete({ timeout: 20 });
	}
	if (message.author.bot) return;
	
	if (client.config.echo == 'true' && message.attachments.size) request([...message.attachments.values()][0].attachment);
	if (message.content.indexOf(client.config.prefix) != 0) return;


	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command);

	if (!cmd) return;

	cmd.run(client, message, args);
}