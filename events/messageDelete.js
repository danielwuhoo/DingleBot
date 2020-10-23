module.exports = async (client, message) => {
    if (!client.config.echo) return;

    if (message.author.bot) return;

    await message.channel.send(`${message.content}\n <@${message.author.id}>`, {files: [...message.attachments.values()]});
}