module.exports = async (client, oldMessage, newMessage) => {
    if (!client.config.echo) return;

    if (oldMessage.author.bot) return;

    if (oldMessage.channel.id === client.config.music) return;
    
    if (oldMessage.content == newMessage.content) return;

    await oldMessage.channel.send(`${oldMessage.content}\n <@${oldMessage.author.id}>`, {files: [...oldMessage.attachments.values()]});
}