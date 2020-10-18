module.exports = async (client, oldMessage, newMessage) => {
    if (!client.config.echoDelete) return;

    if (oldMessage.author.bot) return;
    
    if (oldMessage.content == newMessage.content) return;

    await oldMessage.channel.send(`${oldMessage.content}\n <@${oldMessage.author.id}>`, {files: [...oldMessage.attachments.values()]});
}